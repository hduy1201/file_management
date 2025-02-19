"use client";

import { Button, Input, Select, Tree } from "antd";
import { useState, useEffect, useCallback } from "react";
import { DownOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";

import type { DataNode } from "antd/es/tree";

// ✅ Tạo interface mở rộng `DataNode` với `depth` và `parentId`
interface CustomDataNode extends DataNode {
  depth: number;
  parentId: string | null;
}

export default function MenusPage() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<CustomDataNode[]>([]);
  const [nodeName, setNodeName] = useState<string>("");
  const [nodeDepth, setNodeDepth] = useState<number | null>(null);
  const [parentName, setParentName] = useState<string>("");

  useEffect(() => {
    if (selectedMenu) {
      const cachedData = localStorage.getItem(`treeData-${selectedMenu}`);
      if (cachedData) {
        setTreeData(JSON.parse(cachedData));
        return;
      }

      fetch(`http://64.176.211.47:3000/explore`)
        .then((res) => res.json())
        .then((data) => {
          const formattedData = [formatApiData(data, null, 0)];
          setTreeData(formattedData);
          localStorage.setItem(
            `treeData-${selectedMenu}`,
            JSON.stringify(formattedData)
          );
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
  ): CustomDataNode => ({
    title: node.name || "Unnamed",
    key: node.id,
    depth: depth,
    parentId: parentId,
    children: (node.children || []).map((child: any) =>
      formatApiData(child, node.id, depth + 1)
    ) as CustomDataNode[],
  });

  const fetchNodeChildren = async (nodeKey: string, depth: number) => {
    try {
      const res = await fetch(`http://64.176.211.47:3000/explore/${nodeKey}`);
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
    nodes: CustomDataNode[],
    parentKey: string,
    children: CustomDataNode[]
  ): CustomDataNode[] =>
    nodes.map((node) =>
      node.key === parentKey
        ? { ...node, children: children as CustomDataNode[] } // 🔹 Ép kiểu ở đây
        : {
            ...node,
            children: updateTreeWithChildren(
              (node.children as CustomDataNode[]) || [],
              parentKey,
              children
            ),
          }
    );

  const addNewNode = async (parentKey: string, depth: number) => {
    try {
      const newNodeName = "New Node";
      const response = await fetch("http://64.176.211.47:3000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNodeName, parent_id: parentKey }),
      });

      if (!response.ok)
        throw new Error(`Failed to add node. Status: ${response.status}`);

      const data = await response.json();
      const newNode: CustomDataNode = {
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
      const response = await fetch("http://64.176.211.47:3000/rename", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, id: nodeKey }),
      });

      if (!response.ok)
        throw new Error(`Failed to rename node. Status: ${response.status}`);

      setTreeData((prevTree) => updateNodeName(prevTree, nodeKey, newName));
    } catch (error) {
      console.error("Error renaming node:", error);
    }
  };

  const deleteNode = async (nodeKey: string) => {
    try {
      const response = await fetch(
        `http://64.176.211.47:3000/delete/${nodeKey}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok)
        throw new Error(`Failed to delete node. Status: ${response.status}`);

      setTreeData((prevTree) => removeNode(prevTree, nodeKey));
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const updateNodeName = (
    nodes: CustomDataNode[],
    key: string,
    newName: string
  ): CustomDataNode[] =>
    nodes.map((node) =>
      node.key === key
        ? { ...node, title: newName }
        : {
            ...node,
            children: updateNodeName(
              (node.children as CustomDataNode[]) || [],
              key,
              newName
            ),
          }
    );

  const removeNode = (nodes: CustomDataNode[], key: string): CustomDataNode[] =>
    nodes
      .filter((node) => node.key !== key)
      .map((node) => ({
        ...node,
        children: removeNode((node.children as CustomDataNode[]) || [], key),
      }));

  const onSelectNode = (selectedKeys: React.Key[], { node }: any) => {
    if (selectedKeys.length) {
      setSelectedTreeItem(String(node.key));
      setNodeName(node.title);
      setNodeDepth(node.depth);
      setParentName(node.parentId || "Root");
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
                    <span>
                      {typeof node.title === "function"
                        ? node.title(node)
                        : node.title}
                    </span>
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
