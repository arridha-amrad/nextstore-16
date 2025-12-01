import { ReactNode } from "react";

export type ChildrenProps = {
  children: ReactNode;
};

export type SearchParamsProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
