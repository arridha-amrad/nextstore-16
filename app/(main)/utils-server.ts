import { SearchParamsProps } from "@/types";

export const getPage = (searchParams: SearchParamsProps["searchParams"]) => {
  return searchParams.then((sp) => {
    if (typeof sp.page !== "string") {
      return 1;
    }
    const pageNumber = parseInt(sp.page);
    if (isNaN(pageNumber)) {
      return 1;
    }
    return pageNumber;
  }) as Promise<number>;
};
