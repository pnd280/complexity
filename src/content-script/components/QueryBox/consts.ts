// This file is shared between main-world and isolated context
// DO NOT include react components

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
    label: "O1 Mini",
    shortLabel: "O1 Mini",
    code: "o1",
    provider: "OpenAI",
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
    label: "Sonar Huge",
    shortLabel: "Sonar XL",
    code: "llama_x_large",
    provider: "Perplexity",
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
    label: "Gemini Pro",
    shortLabel: "Gemini",
    code: "gemini",
    provider: "Google",
  },
] as const;

export const imageModels = [
  {
    label: "FLUX.1",
    shortLabel: "FLUX.1",
    code: "flux",
  },
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

export const focusModes = [
  {
    label: "Web",
    code: "internet",
  },
  {
    label: "Writing",
    code: "writing",
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
] as const;
