// app/treeUtils.ts
import type { NodePath, TreeNodeData } from './types';

/**
 * Recursively ensures all folder nodes within a list have an `isOpen` property,
 * defaulting to false if undefined. Also ensures children arrays exist for folders.
 * @param nodeList The list of tree nodes to process.
 * @returns A new list of tree nodes with `isOpen` properties set for all folders.
 */
export const ensureIsOpen = (nodeList: TreeNodeData[]): TreeNodeData[] => {
  return nodeList.map((n) => {
    if (n.type === 'folder') {
      return {
        ...n,
        isOpen: n.isOpen === undefined ? false : n.isOpen,
        children: n.children ? ensureIsOpen(n.children) : [], // Recursively process children
      };
    }
    return n;
  });
};

// --- Core Tree Manipulation Functions ---
export const getNodeAtPath = (
  nodes: TreeNodeData[],
  path: NodePath | null,
): TreeNodeData | null => {
  if (!path) return null;
  let current: TreeNodeData[] | undefined = nodes;
  for (let i = 0; i < path.length; i++) {
    const currentIndex = path[i];
    if (!current || !current[currentIndex]) return null;
    if (i === path.length - 1) return current[currentIndex];
    current = current[currentIndex].children;
  }
  return null;
};

/**
 * Updates a node at a specified path with new data (immutable).
 * This version is refined to correctly handle recursive updates and folder children initialization.
 * @param nodes The array of root nodes.
 * @param path The path to the node to update.
 * @param updates Partial data to update the node with.
 * @returns A new array of root nodes with the update applied.
 */
export const updateNodeAtPath = (
  nodes: TreeNodeData[],
  path: NodePath,
  updates: Partial<TreeNodeData>,
): TreeNodeData[] => {
  return nodes.map((node, index) => {
    if (index !== path[0]) return node; // Not the target node at this level

    if (path.length === 1) {
      // Target node found at the current level
      return { ...node, ...updates };
    }

    // If path is deeper, we need to recurse.
    // The current node must be a folder if we're recursing into its children.
    if (node.type === 'folder') {
      const currentChildren = node.children || []; // Initialize children array if it doesn't exist
      return {
        ...node,
        children: updateNodeAtPath(currentChildren, path.slice(1), updates),
      };
    }

    // If it's not a folder but the path is deeper, this indicates an issue with
    // the path or data structure. Return the node unchanged to prevent errors.
    return node;
  });
};

export const removeNodeAtPath = (
  nodes: TreeNodeData[],
  path: NodePath,
): { newNodes: TreeNodeData[]; removedNode: TreeNodeData | null } => {
  let removedNode: TreeNodeData | null = null;
  const recurse = (
    currentNodes: TreeNodeData[],
    currentPath: NodePath,
  ): TreeNodeData[] => {
    if (currentPath.length === 1) {
      removedNode = currentNodes[currentPath[0]];
      return currentNodes.filter((_, i) => i !== currentPath[0]);
    }
    return currentNodes.map((node, index) => {
      if (index !== currentPath[0]) return node;
      return {
        ...node,
        children: recurse(node.children || [], currentPath.slice(1)),
      };
    });
  };
  const newNodes = recurse(nodes, path);
  return { newNodes, removedNode };
};

export const insertNodeAtPath = (
  nodes: TreeNodeData[],
  basePath: NodePath,
  insertIndex: number,
  nodeToInsert: TreeNodeData,
): TreeNodeData[] => {
  if (basePath.length === 0) {
    const newNodes = [...nodes];
    newNodes.splice(insertIndex, 0, nodeToInsert);
    return newNodes;
  }
  return nodes.map((node, index) => {
    if (index !== basePath[0]) return node;
    const children = node.children || [];
    return {
      ...node,
      children: insertNodeAtPath(
        children,
        basePath.slice(1),
        insertIndex,
        nodeToInsert,
      ),
    };
  });
};

export const createDefaultFolderNode = (): TreeNodeData => ({
  id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  name: 'New Folder',
  type: 'folder',
  isOpen: false,
  children: [],
});

export const createDefaultEmbedNode = (): TreeNodeData => ({
  id: `embed-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  name: 'Aerosmith - Dream On (Official HD Video)',
  type: 'embed',
  embedSrc:
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/iJDtukGW79Y?si=A6BP8arpEmY8t1v_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
});

// --- Initial Data & API Simulation ---
export const initialTreeDataTemplate: TreeNodeData[] = [
  {
    id: 'root-folder-1',
    name: 'My New Tree',
    type: 'folder',
    isOpen: true,
    children: [createDefaultEmbedNode()],
  },
];

export const simulateCreateTreeApiCall = (): Promise<{
  success: boolean;
  treeId: string;
  message: string;
}> => {
  console.log('API CALL: POST /api/tree (creating new tree)');
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTreeId = `tree-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6)}`;
      console.log('API RESPONSE: New tree created with ID:', mockTreeId);
      resolve({
        success: true,
        treeId: mockTreeId,
        message: 'New tree created successfully.',
      });
    }, 1000);
  });
};

export const simulateFetchTreeApiCall = (
  treeId: string,
): Promise<{ success: boolean; data: TreeNodeData[]; message: string }> => {
  console.log(`API CALL: GET /api/tree/${treeId} (fetching tree)`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const fetchedData = JSON.parse(JSON.stringify(initialTreeDataTemplate));
      fetchedData[0].name = `Tree: ${treeId.substring(0, 8)}`;
      console.log(`API RESPONSE: Fetched data for tree ID: ${treeId}`);
      resolve({
        success: true,
        data: fetchedData,
        message: `Tree data for ${treeId} fetched.`,
      });
    }, 1200);
  });
};

export const simulateUpdateTreeApiCall = (
  treeId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: TreeNodeData[],
): Promise<{ success: boolean; message: string }> => {
  console.log(`API CALL: PUT /api/tree/${treeId} (syncing tree)`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        console.log(`API RESPONSE: Tree ${treeId} synced successfully!`);
        resolve({
          success: true,
          message: `Tree ${treeId} synced successfully!`,
        });
      } else {
        const errorMsg = `Failed to sync tree ${treeId}. Simulated network error.`;
        console.error(`API RESPONSE ERROR: ${errorMsg}`);
        reject({ success: false, message: errorMsg });
      }
    }, 1500);
  });
};
