import { Suspense } from "react";
import { ProductRating } from "./rating";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductRating />
    </Suspense>
  );
};

export default Page;
