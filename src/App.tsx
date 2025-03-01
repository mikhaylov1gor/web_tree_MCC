import { useState } from "react";
import TreeNode from "./components/TreeNode.tsx";
import { node } from "./types/node.ts";
import Modal from "./components/Modal.tsx";
import {initialTree} from "./mockData/initialTree.ts"
function App() {
    const [tree, setTree] = useState<node[]>(initialTree);
    const [selectedNode, setSelectedNode] = useState<node | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentText, setCurrentText] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const addNode = (name: string) => {
        setCurrentText("");
        if (!selectedNode) {
            setTree([...tree, { id: Date.now(), name, parent: null, children: [] }]);
        } else {
            const newNode: node = { id: Date.now(), name, parent: selectedNode, children: [] };

            const updateTree = (nodes: node[]): node[] => {
                return nodes.map(n => {
                    if (n.id === selectedNode.id) {
                        return { ...n, children: [...n.children, newNode] };
                    }
                    return { ...n, children: updateTree(n.children) };
                });
            };

            setTree(updateTree(tree));
        }
    };

    const editNode = (newName: string) => {
        if (!selectedNode) return;

        const updateTree = (nodes: node[]): node[] => {
            return nodes.map(n => {
                if (n.id === selectedNode.id) {
                    return { ...n, name: newName };
                }
                return { ...n, children: updateTree(n.children) };
            });
        };

        setTree(updateTree(tree));
        setSelectedNode(prev => (prev ? { ...prev, name: newName } : null));
    };

    const deleteNode = () => {
        if (!selectedNode) return;

        const removeNode = (nodes: node[], id: number): node[] => {
            return nodes
                .filter(n => n.id !== id)
                .map(n => ({ ...n, children: removeNode(n.children, id) }));
        };

        setTree(removeNode(tree, selectedNode.id));
        setSelectedNode(null);
    };

    const resetNode = () => {
        console.log(JSON.stringify(tree, null, 2));
        setTree([])
        setSelectedNode(null);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
        setCurrentText("");
    };

    const openEditModal = () => {
        if (selectedNode) {
            setCurrentText(selectedNode.name);
            setIsEditModalOpen(true);
        }
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const toggleSelectedNode = (node: node) => {
        if (selectedNode?.id === node.id) {
            setSelectedNode(null);
        } else {
            setSelectedNode(node);
        }
    };

    return (
        <div className="container my-5 p-3 border rounded shadow-lg p-3 mb-5 bg-white rounded" style={{ maxWidth: "70%" }}>
            <h1 className="text-center mb-4">Tree</h1>
            <div className="container my-5 p-3 border rounded shadow-sm p-3 mb-5 bg-light rounded" style={{ maxWidth: "100%" }}>
                {tree.map((node) => (
                    <TreeNode key={node.id} node={node} onSelect={toggleSelectedNode} selectedNode={selectedNode} />
                ))}
            </div>
            <div className="btn-toolbar d-flex justify-content-center" role="toolbar">
                <button type="button" className="btn btn-success" style={{ width: "10%" }} onClick={openAddModal}>Add</button>
                <button type="button" className="btn btn-secondary" style={{ width: "10%" }} onClick={openEditModal} disabled={!selectedNode}>Edit</button>
                <button type="button" className="btn btn-warning" style={{ width: "10%" }} onClick={deleteNode} disabled={!selectedNode}>Delete</button>
                <button type="button" className="btn btn-danger" style={{ width: "10%" }} onClick={resetNode}>Reset</button>
            </div>
            <Modal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSave={addNode}
                currentText={""}
                title="Введите название нового узла"
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={editNode}
                currentText={currentText}
                title="Редактирование узла"
            />
        </div>
    );
}

export default App;
