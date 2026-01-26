import type {
  Fiber,
  FiberPath,
  VisitedNodesRef,
} from "@/utils/dom-utils/fiber-search/types";

type TraversalParams = {
  startFiber: Fiber;
  nodeMatches: (node: Fiber) => boolean;
  maxDepth: number;
  visitedNodesRef: VisitedNodesRef;
};

type MultipleTraversalParams = TraversalParams & {
  expectSameDepth: boolean;
};

export function searchAllFibers(params: MultipleTraversalParams) {
  const {
    startFiber,
    nodeMatches,
    maxDepth,
    expectSameDepth,
    visitedNodesRef,
  } = params;
  const resultPaths: FiberPath[] = [];
  const stackNodes: (Fiber | null)[] = [startFiber];
  const stackDepths: number[] = [0];
  const stackPaths: ("child" | "sibling")[][] = [[]];
  let targetDepth: number | null = null;

  while (stackNodes.length) {
    const node = stackNodes.pop();
    const depth = stackDepths.pop();
    const currentPath = stackPaths.pop();
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      depth > maxDepth
    )
      continue;

    if (expectSameDepth && targetDepth != null && depth !== targetDepth) {
      continue;
    }

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      resultPaths.push({ directions: currentPath });
      if (expectSameDepth && targetDepth == null) {
        targetDepth = depth;
      }
    }

    const sibling = node.sibling;
    if (sibling != null) {
      stackNodes.push(sibling);
      stackDepths.push(depth);
      stackPaths.push([...currentPath, "sibling"]);
    }
    const child = node.child;
    if (child != null && (!expectSameDepth || targetDepth == null)) {
      stackNodes.push(child);
      stackDepths.push(depth + 1);
      stackPaths.push([...currentPath, "child"]);
    }
  }

  return resultPaths;
}

export function searchAllFibersWithUpward(params: MultipleTraversalParams) {
  const {
    startFiber,
    nodeMatches,
    maxDepth,
    expectSameDepth,
    visitedNodesRef,
  } = params;
  const resultPaths: FiberPath[] = [];
  const stackNodes: (Fiber | null)[] = [startFiber];
  const stackDepths: number[] = [0];
  const stackPaths: ("child" | "sibling" | "return")[][] = [[]];
  const visited = new Set<Fiber>();
  let targetDepth: number | null = null;

  while (stackNodes.length) {
    const node = stackNodes.pop();
    const depth = stackDepths.pop();
    const currentPath = stackPaths.pop();
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      Math.abs(depth) > maxDepth
    )
      continue;

    if (visited.has(node)) continue;
    visited.add(node);

    if (expectSameDepth && targetDepth != null && depth !== targetDepth) {
      continue;
    }

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      resultPaths.push({ directions: currentPath });
      if (expectSameDepth && targetDepth == null) {
        targetDepth = depth;
      }
    }

    // Traverse downward (child and sibling)
    const sibling = node.sibling;
    if (sibling != null && !visited.has(sibling)) {
      stackNodes.push(sibling);
      stackDepths.push(depth);
      stackPaths.push([...currentPath, "sibling"]);
    }
    const child = node.child;
    if (
      child != null &&
      !visited.has(child) &&
      (!expectSameDepth || targetDepth == null)
    ) {
      stackNodes.push(child);
      stackDepths.push(depth + 1);
      stackPaths.push([...currentPath, "child"]);
    }

    // Traverse upward (return)
    const parent = node.return;
    if (
      parent != null &&
      !visited.has(parent) &&
      (!expectSameDepth || targetDepth == null)
    ) {
      stackNodes.push(parent);
      stackDepths.push(depth - 1);
      stackPaths.push([...currentPath, "return"]);
    }

    // Traverse upward siblings (parent's siblings)
    if (parent != null) {
      const parentSibling = parent.sibling;
      if (parentSibling != null && !visited.has(parentSibling)) {
        stackNodes.push(parentSibling);
        stackDepths.push(depth - 1);
        stackPaths.push([...currentPath, "return", "sibling"]);
      }
    }
  }

  return resultPaths;
}

export function searchAllFibersUpward(params: MultipleTraversalParams) {
  const {
    startFiber,
    nodeMatches,
    maxDepth,
    expectSameDepth,
    visitedNodesRef,
  } = params;
  const resultPaths: FiberPath[] = [];
  const stackNodes: (Fiber | null)[] = [startFiber];
  const stackDepths: number[] = [0];
  const stackPaths: ("return" | "sibling")[][] = [[]];
  const visited = new Set<Fiber>();
  let targetDepth: number | null = null;

  while (stackNodes.length) {
    const node = stackNodes.pop();
    const depth = stackDepths.pop();
    const currentPath = stackPaths.pop();
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      Math.abs(depth) > maxDepth
    )
      continue;

    if (visited.has(node)) continue;
    visited.add(node);

    if (expectSameDepth && targetDepth != null && depth !== targetDepth) {
      continue;
    }

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      resultPaths.push({ directions: currentPath });
      if (expectSameDepth && targetDepth == null) {
        targetDepth = depth;
      }
    }

    // Only traverse upward (return)
    const parent = node.return;
    if (
      parent != null &&
      !visited.has(parent) &&
      (!expectSameDepth || targetDepth == null)
    ) {
      stackNodes.push(parent);
      stackDepths.push(depth - 1);
      stackPaths.push([...currentPath, "return"]);
    }

    // Traverse upward siblings (parent's siblings)
    if (parent != null) {
      const parentSibling = parent.sibling;
      if (parentSibling != null && !visited.has(parentSibling)) {
        stackNodes.push(parentSibling);
        stackDepths.push(depth - 1);
        stackPaths.push([...currentPath, "return", "sibling"]);
      }
    }

    // Also check current node's siblings at the same level (when going upward, siblings are lateral moves)
    const sibling = node.sibling;
    if (sibling != null && !visited.has(sibling)) {
      stackNodes.push(sibling);
      stackDepths.push(depth);
      stackPaths.push([...currentPath, "sibling"]);
    }
  }

  return resultPaths;
}

export function searchSingleFiber(params: TraversalParams) {
  const { startFiber, nodeMatches, maxDepth, visitedNodesRef } = params;
  const queueNodes: (Fiber | null)[] = [startFiber];
  const queueDepths: number[] = [0];
  const queuePaths: ("child" | "sibling")[][] = [[]];
  let head = 0;

  while (head < queueNodes.length) {
    const node = queueNodes[head];
    const depth = queueDepths[head];
    const currentPath = queuePaths[head];
    head++;
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      depth > maxDepth
    )
      continue;

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      return { directions: currentPath };
    }

    const child = node.child;
    if (child != null) {
      queueNodes.push(child);
      queueDepths.push(depth + 1);
      queuePaths.push([...currentPath, "child"]);
    }
    const sibling = node.sibling;
    if (sibling != null) {
      queueNodes.push(sibling);
      queueDepths.push(depth);
      queuePaths.push([...currentPath, "sibling"]);
    }
  }

  return null;
}

export function searchSingleFiberUpward(params: TraversalParams) {
  const { startFiber, nodeMatches, maxDepth, visitedNodesRef } = params;
  const queueNodes: (Fiber | null)[] = [startFiber];
  const queueDepths: number[] = [0];
  const queuePaths: ("return" | "sibling")[][] = [[]];
  const visited = new Set<Fiber>();
  let head = 0;

  while (head < queueNodes.length) {
    const node = queueNodes[head];
    const depth = queueDepths[head];
    const currentPath = queuePaths[head];
    head++;
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      Math.abs(depth) > maxDepth
    )
      continue;

    if (visited.has(node)) continue;
    visited.add(node);

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      return { directions: currentPath };
    }

    // Only traverse upward (return)
    const parent = node.return;
    if (parent != null && !visited.has(parent)) {
      queueNodes.push(parent);
      queueDepths.push(depth - 1);
      queuePaths.push([...currentPath, "return"]);
    }

    // Traverse upward siblings (parent's siblings)
    if (parent != null) {
      const parentSibling = parent.sibling;
      if (parentSibling != null && !visited.has(parentSibling)) {
        queueNodes.push(parentSibling);
        queueDepths.push(depth - 1);
        queuePaths.push([...currentPath, "return", "sibling"]);
      }
    }

    // Also check current node's siblings at the same level (lateral moves)
    const sibling = node.sibling;
    if (sibling != null && !visited.has(sibling)) {
      queueNodes.push(sibling);
      queueDepths.push(depth);
      queuePaths.push([...currentPath, "sibling"]);
    }
  }

  return null;
}

export function searchSingleFiberWithUpward(params: TraversalParams) {
  const { startFiber, nodeMatches, maxDepth, visitedNodesRef } = params;
  const queueNodes: (Fiber | null)[] = [startFiber];
  const queueDepths: number[] = [0];
  const queuePaths: ("child" | "sibling" | "return")[][] = [[]];
  const visited = new Set<Fiber>();
  let head = 0;

  while (head < queueNodes.length) {
    const node = queueNodes[head];
    const depth = queueDepths[head];
    const currentPath = queuePaths[head];
    head++;
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      Math.abs(depth) > maxDepth
    )
      continue;

    if (visited.has(node)) continue;
    visited.add(node);

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      return { directions: currentPath };
    }

    // Traverse downward (child and sibling)
    const child = node.child;
    if (child != null && !visited.has(child)) {
      queueNodes.push(child);
      queueDepths.push(depth + 1);
      queuePaths.push([...currentPath, "child"]);
    }
    const sibling = node.sibling;
    if (sibling != null && !visited.has(sibling)) {
      queueNodes.push(sibling);
      queueDepths.push(depth);
      queuePaths.push([...currentPath, "sibling"]);
    }

    // Traverse upward (return)
    const parent = node.return;
    if (parent != null && !visited.has(parent)) {
      queueNodes.push(parent);
      queueDepths.push(depth - 1);
      queuePaths.push([...currentPath, "return"]);
    }

    // Traverse upward siblings (parent's siblings)
    if (parent != null) {
      const parentSibling = parent.sibling;
      if (parentSibling != null && !visited.has(parentSibling)) {
        queueNodes.push(parentSibling);
        queueDepths.push(depth - 1);
        queuePaths.push([...currentPath, "return", "sibling"]);
      }
    }
  }

  return null;
}
