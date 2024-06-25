function isSupportedArtifact(artifact: string): boolean {
  return artifact === 'mermaid';
}

const artifactsUtils = {
  isSupportedArtifact,
}

export default artifactsUtils;
