export const languageModels = [
  {
    label: "Claude 3.5 Sonnet",
    shortLabel: "Sonnet",
    code: "claude2",
    provider: "Anthropic",
  },
  {
    label: "Claude 3 Opus",
    shortLabel: "Opus",
    code: "claude3opus",
    provider: "Anthropic",
  },
  {
    label: "GPT-4 Omni",
    shortLabel: "GPT-4o",
    code: "gpt4o",
    provider: "OpenAI",
  },
  {
    label: "GPT-4 Turbo",
    shortLabel: "GPT-4",
    code: "gpt4",
    provider: "OpenAI",
  },
  {
    label: "Llama 3.1 405B",
    shortLabel: "Llama 3.1 405B",
    code: "llama_x_large",
    provider: "Meta",
  },
  {
    label: "Sonar Large",
    shortLabel: "Sonar",
    code: "experimental",
    provider: "Perplexity",
  },
  {
    label: "Default",
    shortLabel: "Default",
    code: "turbo",
    provider: "Perplexity",
  },
  {
    label: "Mistral Large",
    shortLabel: "Mistral",
    code: "mistral",
    provider: "Mistral",
  },
  {
    label: "Gemini Pro 1.0",
    shortLabel: "Gemini",
    code: "gemini",
    provider: "Google",
  },
] as const;

export const imageModels = [
  {
    label: "DALL-E 3",
    shortLabel: "DALL-E",
    code: "dall-e-3",
  },
  {
    label: "Playground",
    shortLabel: "Playground",
    code: "default",
  },
  {
    label: "Stable Diffusion XL",
    shortLabel: "SDXL",
    code: "sdxl",
  },
] as const;

export const webAccessFocus = [
  {
    label: "All",
    code: "internet",
  },
  {
    label: "Wikipedia",
    code: "wikipedia",
  },
  {
    label: "Academic",
    code: "scholar",
  },
  {
    label: "Math",
    code: "wolfram",
  },
  {
    label: "Video",
    code: "youtube",
  },
  {
    label: "Social",
    code: "reddit",
  },
  {
    label: "Finance",
    code: "finance",
  },
] as const;
