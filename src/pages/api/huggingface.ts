import { HUGGINGFACE_INFERENCE_URL } from "@/utils/constants";

const hgToken = import.meta.env.HG_API_TOKEN;

export async function drawImage(
  token: string,
  model: string,
  prompt: string,
  negative_prompt?: string,
  wait_for_model?: boolean
) {
  const payload = {
    inputs: prompt,
    parameters: {
      negative_prompt: negative_prompt ? [negative_prompt] : undefined,
      num_images_per_prompt: 1,
    },
    options: {},
  };
  if (wait_for_model)
    payload.options = {
      wait_for_model: true,
    };
  return fetch(`${HUGGINGFACE_INFERENCE_URL}/models/${model}`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(payload),
  });
}


export const post = async (context) => {
    const body = await context.request.json()
    const { model, prompt, negative_prompt } = body
    const _token = hgToken;

    if (!_token) throw new Error("Access token not set.");
    let _response = await drawImage(
        _token,
        model,
        prompt,
        negative_prompt
    );
    if (_response.status == 503) {
        _response = await drawImage(
            _token,
            model,
            prompt,
            negative_prompt
        );
    }
    return _response;
}