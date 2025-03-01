import { node } from "../types/node.ts";

function TreeNode({ node, onSelect, selectedNode }: { node: node; onSelect: (node: node) => void; selectedNode: node | null }) {
    const isSelected = selectedNode?.id === node.id;

    return (
        <div className="border rounded-lg"
            style={{
                marginLeft: "20px",
                marginBottom: "3px",
                cursor: "pointer",
                backgroundColor: isSelected ? "lightblue" : "white",
                padding: "5px",
                borderRadius: "4px",
            }}
             onClick={(e) => {
                 e.stopPropagation();
                 onSelect(node);
             }}
        >
            <span>{node.name}</span>
            <div>
                {node.children.map((child) => (
                    <TreeNode key={child.id} node={child} onSelect={onSelect} selectedNode={selectedNode} />
                ))}
            </div>
        </div>
    );
}

export default TreeNode;
