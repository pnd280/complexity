export function findReactFiberNodeValue<T>({
  fiberNode,
  condition,
  select,
}: {
  fiberNode: any;
  condition: (fiberNode: any) => boolean;
  select: (fiberNode: any) => T;
}): T | null {
  if (fiberNode == null) return null;

  const tree = fiberNode.alternate ?? fiberNode;

  if (condition?.(tree)) return select?.(tree);

  return null;

  // return (
  //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //   findReactFiberNodeValue({
  //     fiberNode: tree.child,
  //     condition,
  //     select,
  //   }) ||
  //   findReactFiberNodeValue({
  //     fiberNode: tree.sibling,
  //     condition,
  //     select,
  //   })
  // );
}

export function walkFiberNode(fiberNode: any, path: string[]) {
  try {
    return path.reduce((acc, key) => acc[key], fiberNode);
  } catch {
    return null;
  }
}
