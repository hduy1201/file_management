"use client";

import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import Logo from "@/assets/logo.png";
import Image from "next/image";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Lấy key dựa vào route hiện tại
  const getSelectedKey = () => {
    if (pathname.includes("/system-code")) return "2";
    if (pathname.includes("/properties")) return "3";
    if (pathname.includes("/menus")) return "4";
    if (pathname.includes("/api-list")) return "5";
    if (pathname.includes("/users-group")) return "6";
    if (pathname.includes("/competition")) return "7";
    return "systems"; // Mặc định nếu không có route nào trùng
  };

  const [selectedKey, setSelectedKey] = useState(getSelectedKey());

  useEffect(() => {
    setSelectedKey(getSelectedKey());
  }, [pathname]);

  const menuItems = [
    {
      key: "systems",
      icon: <FolderOutlined />,
      label: "Systems",
      children: [
        {
          key: "2",
          label: "System Code",
          icon: <AppstoreOutlined />,
          onClick: () => router.push("/system-code"),
        },
        {
          key: "3",
          label: "Properties",
          icon: <AppstoreOutlined />,
          onClick: () => router.push("/properties"),
        },
        {
          key: "4",
          label: "Menus",
          icon: <AppstoreOutlined />,
          onClick: () => router.push("/menus"),
        },
        {
          key: "5",
          label: "API List",
          icon: <AppstoreOutlined />,
          onClick: () => router.push("/api-list"),
        },
      ],
    },
    {
      key: "6",
      icon: <FolderOutlined />,
      label: "Users & Group",
      onClick: () => router.push("/users-group"),
    },
    {
      key: "7",
      icon: <FolderOutlined />,
      label: "Competition",
      onClick: () => router.push("/competition"),
    },
  ];

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="h-full bg-[#0f111d] text-white rounded-3xl"
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between px-4 py-5">
        <Image src={Logo} alt="Logo" className="w-16" />
        <button onClick={() => setCollapsed(!collapsed)} className="text-white">
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["systems"]}
        className="bg-[#0f111d] text-white custom-ant-menu"
        style={{ backgroundColor: "#0f111d" }}
        items={menuItems}
      />

      <style jsx global>{`
        .custom-ant-menu .ant-menu-item-selected {
          background-color: #9ff443 !important;
          color: black !important;
          font-weight: bold;
        }
      `}</style>
    </Sider>
  );
};

export default Sidebar;
