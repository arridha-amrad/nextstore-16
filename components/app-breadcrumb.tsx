"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";
import React from "react";

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((v) => v !== "");

  const breadcrumbLinks = paths.map((v, i) => {
    if (i === 0) {
      return {
        label: v,
        url: `/${v}`,
      };
    }
    const prev = paths.slice(0, i).map((v) => `/${v}`);
    const prevUrl = prev.join("");
    return {
      label: v,
      url: `${prevUrl}/${v}`,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbLinks.map((link, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              {i === breadcrumbLinks.length - 1 ? (
                <BreadcrumbPage>{link.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={link.url}>{link.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i !== breadcrumbLinks.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// <BreadcrumbItem>
//   <BreadcrumbLink href="/">Home</BreadcrumbLink>
// </BreadcrumbItem>
// <BreadcrumbSeparator />
// <BreadcrumbItem>
//   <BreadcrumbLink href="/components">Components</BreadcrumbLink>
// </BreadcrumbItem>
// <BreadcrumbSeparator />
// <BreadcrumbItem>
//   <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
// </BreadcrumbItem>
