"use client";

import { Button, Input, Select, Tree } from "antd";
import { useState, useEffect } from "react";
import { DownOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";
import type { TreeDataNode } from "antd/es/tree";

export default function MenusPage() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null); // Lưu parent_id
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [nodeName, setNodeName] = useState<string>("");
  const [nodeDepth, setNodeDepth] = useState<number | null>(null);
  const [parentName, setParentName] = useState<string>("");

  useEffect(() => {
    if (selectedMenu) {
      fetch("http://localhost:3000/explore")
        .then((res) => res.json())
        .then((data) => {
          setTreeData([formatApiData(data, null, 0)]); // Root không có parent_id
        })
        .catch((err) => console.error("Error fetching data:", err));
    } else {
      setTreeData([]);
    }
  }, [selectedMenu]);

  const formatApiData = (
    node: any,
    parentId: string | null,
    depth: number
  ): TreeDataNode => ({
    title: node.name || "Unnamed",
    key: node.id || `temp-${Math.random()}`,
    depth: depth,
    parentId: parentId, // Lưu parent_id ngay tại đây
    children: node.children
      ? node.children.map((child: any) =>
          formatApiData(child, node.id, depth + 1)
        )
      : [],
  });

  const fetchNodeChildren = async (nodeKey: string, depth: number) => {
    try {
      const res = await fetch(`http://localhost:3000/explore/${nodeKey}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      const newChildren = data.children.map((child: any) =>
        formatApiData(child, nodeKey, depth + 1)
      );

      setTreeData((prevTree) =>
        updateTreeWithChildren(prevTree, nodeKey, newChildren)
      );
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const updateTreeWithChildren = (
    nodes: TreeDataNode[],
    parentKey: string,
    children: TreeDataNode[]
  ): TreeDataNode[] =>
    nodes.map((node) => {
      if (node.key === parentKey) {
        return { ...node, children: [...node.children, ...children] };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeWithChildren(node.children, parentKey, children),
        };
      }
      return node;
    });

  const addNewNode = async (parentKey: string, depth: number) => {
    try {
      const newNodeName = "New Node";
      const response = await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNodeName, parent_id: parentKey }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add node. Status: ${response.status}`);
      }

      const data = await response.json();
      const newNode: TreeDataNode = {
        title: newNodeName,
        key: data.id,
        depth: depth + 1,
        parentId: parentKey,
        children: [],
      };

      setTreeData((prevTree) =>
        updateTreeWithChildren(prevTree, parentKey, [newNode])
      );
    } catch (error) {
      console.error("Error adding node:", error);
    }
  };

  const renameNode = async (nodeKey: string, newName: string) => {
    try {
      if (!selectedParentId) {
        return;
      }

      console.log(nodeKey);

      const response = await fetch("http://localhost:3000/rename", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, id: nodeKey }),
      });

      if (!response.ok) {
        throw new Error(`Failed to rename node. Status: ${response.status}`);
      }

      setTreeData((prevTree) => updateNodeName(prevTree, nodeKey, newName));
    } catch (error) {
      console.error("Error renaming node:", error);
    }
  };

  const deleteNode = async (nodeKey: string) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${nodeKey}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete node. Status: ${response.status}`);
      }

      setTreeData((prevTree) => removeNode(prevTree, nodeKey));
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const updateNodeName = (
    nodes: TreeDataNode[],
    key: string,
    newName: string
  ): TreeDataNode[] =>
    nodes.map((node) => {
      if (node.key === key) return { ...node, title: newName };
      if (node.children)
        return {
          ...node,
          children: updateNodeName(node.children, key, newName),
        };
      return node;
    });

  const removeNode = (nodes: TreeDataNode[], key: string): TreeDataNode[] =>
    nodes
      .filter((node) => node.key !== key)
      .map((node) => ({
        ...node,
        children: removeNode(node.children || [], key),
      }));

  const onSelectNode = (selectedKeys: React.Key[], { node }: any) => {
    if (selectedKeys.length) {
      setSelectedTreeItem(String(node.key));
      setNodeName(node.title);
      setNodeDepth(node.depth);
      setParentName(node.parentId || "Root");
      setSelectedParentId(node.parentId); // Lưu `parent_id` ngay khi chọn
    }
  };

  const onExpand = (expandedKeys: React.Key[], { node }: any) => {
    console.log("Expanded node:", node);
    console.log("Node children before condition:", node.children);

    if (Array.isArray(node.children) && node.children.length > 0) {
      node.children.forEach((child: any) => {
        if (!child.children || child.children.length === 0) {
          console.log(`Fetching children for child: ${child.key}`);
          fetchNodeChildren(child.key as string, node.depth + 1);
        }
      });
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-1/3">
        <div className="w-full mt-4">
          <p className="mb-1">Menu</p>
          <Select
            className="w-full"
            showSearch
            placeholder="Select a menu item"
            optionFilterProp="label"
            options={[
              { value: "system management", label: "System Management" },
            ]}
            onChange={(value) => {
              setSelectedMenu(value);
              setSelectedTreeItem(null);
            }}
            allowClear
          />
        </div>

        {selectedMenu && (
          <>
            <div className="mt-6 bg-white p-4">
              <Tree
                showLine
                treeData={treeData}
                switcherIcon={({ expanded }) =>
                  expanded ? (
                    <DownOutlined className="text-gray-500" />
                  ) : (
                    <RightOutlined className="text-gray-500" />
                  )
                }
                onExpand={onExpand}
                onSelect={onSelectNode}
                titleRender={(node) => (
                  <div className="flex items-center justify-between w-full">
                    <span>{node.title}</span>
                    <Button
                      icon={<PlusOutlined />}
                      size="small"
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewNode(node.key as string, node.depth);
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </>
        )}
      </div>

      {selectedMenu && selectedTreeItem && (
        <div className="w-2/3 bg-white p-6">
          <h2 className="text-xl font-semibold">Menu Details</h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-1">Menu ID</p>
              <Input disabled value={selectedTreeItem} />
            </div>

            <div>
              <p className="mb-1">Depth</p>
              <Input
                disabled
                value={nodeDepth !== null ? nodeDepth.toString() : ""}
              />
            </div>

            <div>
              <p className="mb-1">Parent Name</p>
              <Input disabled value={parentName} />
            </div>

            <div>
              <p className="mb-1">Name</p>
              <Input
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="primary"
                className="w-1/2"
                onClick={() => renameNode(selectedTreeItem, nodeName)}
              >
                Save
              </Button>
              <Button
                danger
                className="w-1/2"
                onClick={() => deleteNode(selectedTreeItem)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
