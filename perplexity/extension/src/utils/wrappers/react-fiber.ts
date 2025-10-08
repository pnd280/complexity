// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function walkFiberNode(fiberNode: any, path: string[]) {
  try {
    return path.reduce((acc, key) => acc[key], fiberNode);
  } catch {
    return null;
  }
}

export function getReactPropsKey(element: Element) {
  return (
    Object.keys(element).find((key) => key.startsWith("__reactProps$")) || ""
  );
}

export function getReactFiberKey(element: Element) {
  return (
    Object.keys(element).find((key) => key.startsWith("__reactFiber$")) || ""
  );
}
