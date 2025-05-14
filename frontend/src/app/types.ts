// app/types.ts
// This file's content remains the same and stays in app/

/**
 * Represents the structure of a single node in the tree.
 */
export interface TreeNodeData {
  id: string;
  name: string;
  type: 'folder' | 'embed' | 'file';
  isOpen?: boolean;
  children?: TreeNodeData[];
  embedSrc?: string; // For 'embed' type, stores the HTML/iframe source
}

/**
 * Represents the path to a node in the tree, as an array of indices.
 */
export type NodePath = number[];

/**
 * Describes the visual indicator for a drop operation.
 * targetPath: The path to the node over which the item is being dragged.
 * position: Where the dragged item will be placed relative to the target.
 */
export interface DropIndicator {
  targetPath: NodePath;
  position: 'before' | 'after' | 'child';
}

/**
 * Represents the state related to drag and drop operations within the tree.
 */
export interface TreeDragState {
  draggedItemPath: NodePath | null;
  dropIndicator: DropIndicator | null;
}
