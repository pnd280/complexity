interface BatchedMutationInfo {
  addedNodes: Node[];
  removedNodes: Node[];
  oldValue: string | null;
}

function createNodeList(nodes: Node[]): NodeList {
  const fragment = document.createDocumentFragment();
  nodes.forEach((node) => fragment.appendChild(node.cloneNode(true)));
  return fragment.childNodes;
}

export function batchMutations(mutations: MutationRecord[]): MutationRecord[] {
  const batchMap = new Map<Node, Map<string, BatchedMutationInfo>>();

  for (const mutation of mutations) {
    if (!batchMap.has(mutation.target)) {
      batchMap.set(mutation.target, new Map());
    }
    const targetMap = batchMap.get(mutation.target)!;

    if (!targetMap.has(mutation.type)) {
      targetMap.set(mutation.type, {
        addedNodes: [],
        removedNodes: [],
        oldValue: null,
      });
    }
    const batchInfo = targetMap.get(mutation.type)!;

    switch (mutation.type) {
      case 'childList':
        batchInfo.addedNodes.push(...Array.from(mutation.addedNodes));
        batchInfo.removedNodes.push(...Array.from(mutation.removedNodes));
        break;
      case 'attributes':
      case 'characterData':
        batchInfo.oldValue = mutation.oldValue;
        break;
    }
  }

  const batchedMutations: MutationRecord[] = [];

  batchMap.forEach((targetMap, target) => {
    targetMap.forEach((batchInfo, type) => {
      const batchedMutation: MutationRecord = {
        type: type as MutationRecordType,
        target,
        addedNodes:
          type === 'childList'
            ? createNodeList(batchInfo.addedNodes)
            : createNodeList([]),
        removedNodes:
          type === 'childList'
            ? createNodeList(batchInfo.removedNodes)
            : createNodeList([]),
        attributeName:
          type === 'attributes'
            ? mutations.find(
                (m) => m.target === target && m.type === 'attributes'
              )?.attributeName || null
            : null,
        attributeNamespace:
          type === 'attributes'
            ? mutations.find(
                (m) => m.target === target && m.type === 'attributes'
              )?.attributeNamespace || null
            : null,
        oldValue: batchInfo.oldValue,
        nextSibling: null,
        previousSibling: null,
      };
      batchedMutations.push(batchedMutation);
    });
  });

  return batchedMutations;
}
