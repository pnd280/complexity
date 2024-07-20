interface BatchedMutationInfo {
  addedNodes: Set<Node>;
  removedNodes: Set<Node>;
  attributes: Map<string, string | null>;
  characterData: string | null;
}

function createNodeList(nodes: Set<Node>): NodeList {
  const fragment = document.createDocumentFragment();
  nodes.forEach((node) => fragment.appendChild(node.cloneNode(true)));
  return fragment.childNodes;
}

export function batchMutations(mutations: MutationRecord[]): MutationRecord[] {
  const batchMap = new Map<Node, BatchedMutationInfo>();

  for (const mutation of mutations) {
    if (!batchMap.has(mutation.target)) {
      batchMap.set(mutation.target, {
        addedNodes: new Set(),
        removedNodes: new Set(),
        attributes: new Map(),
        characterData: null,
      });
    }
    const batchInfo = batchMap.get(mutation.target)!;

    switch (mutation.type) {
      case 'childList':
        mutation.addedNodes.forEach((node) => {
          batchInfo.removedNodes.delete(node);
          batchInfo.addedNodes.add(node);
        });
        mutation.removedNodes.forEach((node) => {
          if (!batchInfo.addedNodes.delete(node)) {
            batchInfo.removedNodes.add(node);
          }
        });
        break;
      case 'attributes':
        batchInfo.attributes.set(mutation.attributeName!, mutation.oldValue);
        break;
      case 'characterData':
        batchInfo.characterData = mutation.oldValue;
        break;
    }
  }

  const batchedMutations: MutationRecord[] = [];

  batchMap.forEach((batchInfo, target) => {
    if (batchInfo.addedNodes.size > 0 || batchInfo.removedNodes.size > 0) {
      batchedMutations.push({
        type: 'childList',
        target,
        addedNodes: createNodeList(batchInfo.addedNodes),
        removedNodes: createNodeList(batchInfo.removedNodes),
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      });
    }

    if (batchInfo.attributes.size > 0) {
      batchInfo.attributes.forEach((oldValue, attributeName) => {
        batchedMutations.push({
          type: 'attributes',
          target,
          attributeName,
          attributeNamespace: null,
          oldValue,
          addedNodes: createNodeList(new Set()),
          removedNodes: createNodeList(new Set()),
          previousSibling: null,
          nextSibling: null,
        });
      });
    }

    if (batchInfo.characterData !== null) {
      batchedMutations.push({
        type: 'characterData',
        target,
        oldValue: batchInfo.characterData,
        addedNodes: createNodeList(new Set()),
        removedNodes: createNodeList(new Set()),
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
      });
    }
  });

  return batchedMutations;
}
