"use client";

import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";

import { FolderFilled } from "@ant-design/icons";

import Icon from "@/assets/icon.png";
import Image from "next/image";

const Breadcrumbs = () => {
  const pathname = usePathname();

  const breadcrumbItems = pathname
    .split("/")
    .filter((item) => item)
    .map((item, index, array) => ({
      title: item.charAt(0).toUpperCase() + item.slice(1),
      href: "/" + array.slice(0, index + 1).join("/"),
    }));

  return (
    <>
      {breadcrumbItems.length > 0 && (
        <>
          <Breadcrumb
            className="text-gray-400"
            items={[{ title: <FolderFilled />, href: "/" }, ...breadcrumbItems]}
          />
          <div className="flex items-center my-4">
            <Image src={Icon} alt="Logo" className="w-14" />
            <h2 className="text-2xl font-bold ml-2">
              {breadcrumbItems.map((item, index) => (
                <span key={index}>
                  {item.title}
                  {index < breadcrumbItems.length - 1 && " / "}
                </span>
              ))}
            </h2>
          </div>
        </>
      )}
    </>
  );
};

export default Breadcrumbs;
