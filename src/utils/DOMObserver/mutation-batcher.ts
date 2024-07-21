type BatchedMutationInfo = {
  addedNodes: Set<Node>;
  removedNodes: Set<Node>;
  attributes: Set<string>;
  characterData: boolean;
};

export function batchMutations(mutations: MutationRecord[]): MutationRecord[] {
  const batchMap = new Map<Node, BatchedMutationInfo>();

  for (const mutation of mutations) {
    let batchInfo = batchMap.get(mutation.target);
    if (!batchInfo) {
      batchInfo = {
        addedNodes: new Set(),
        removedNodes: new Set(),
        attributes: new Set(),
        characterData: false,
      };
      batchMap.set(mutation.target, batchInfo);
    }

    switch (mutation.type) {
      case 'childList':
        for (const node of mutation.addedNodes) {
          batchInfo.removedNodes.delete(node);
          batchInfo.addedNodes.add(node);
        }
        for (const node of mutation.removedNodes) {
          if (!batchInfo.addedNodes.delete(node)) {
            batchInfo.removedNodes.add(node);
          }
        }
        break;
      case 'attributes':
        if (mutation.attributeName) {
          batchInfo.attributes.add(mutation.attributeName);
        }
        break;
      case 'characterData':
        batchInfo.characterData = true;
        break;
    }
  }

  const batchedMutations: MutationRecord[] = [];

  batchMap.forEach((batchInfo, target) => {
    if (batchInfo.addedNodes.size > 0 || batchInfo.removedNodes.size > 0) {
      batchedMutations.push({
        type: 'childList',
        target,
        addedNodes: Array.from(batchInfo.addedNodes),
        removedNodes: Array.from(batchInfo.removedNodes),
        attributeName: null,
        oldValue: null,
      } as unknown as MutationRecord);
    }

    if (batchInfo.attributes.size > 0) {
      batchedMutations.push({
        type: 'attributes',
        target,
        attributeName: Array.from(batchInfo.attributes),
        oldValue: null,
      } as unknown as MutationRecord);
    }

    if (batchInfo.characterData) {
      batchedMutations.push({
        type: 'characterData',
        target,
        oldValue: null,
      } as unknown as MutationRecord);
    }
  });

  return batchedMutations;
}
