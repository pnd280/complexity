import {
  ARTIFACT_LANGUAGES,
  type ArtifactLanguage,
} from "@/plugins/thread-artifacts/types";

export const isArtifactLanguageString = (
  languageString: string | null | undefined,
): languageString is ArtifactLanguage => {
  if (languageString == null) return false;

  return languageString in ARTIFACT_LANGUAGES;
};

export const isAutonomousArtifactLanguageString = (
  languageString: string | null | undefined,
): boolean => {
  if (languageString == null) return false;

  if (
    !languageString.startsWith("canvas:") &&
    !languageString.startsWith("artifact:")
  )
    return false;

  const language = languageString.split(":")[1];

  if (!language) return false;

  return isArtifactLanguageString(language);
};

export const getInterpretedArtifactLanguage = (
  languageString: string,
): ArtifactLanguage | undefined => {
  if (isArtifactLanguageString(languageString))
    return ARTIFACT_LANGUAGES[languageString];

  if (isAutonomousArtifactLanguageString(languageString))
    return languageString.split(":")[1] as ArtifactLanguage;
};

export function getArtifactTitle(languageString: string | undefined | null) {
  if (!languageString) return "";
  if (!isAutonomousArtifactLanguageString(languageString)) return "";
  return languageString.split(":")[2] ?? "";
}

export function formatArtifactTitle(title: string) {
  return title
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
