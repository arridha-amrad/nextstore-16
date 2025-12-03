"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useSession } from "@/lib/auth-client";
import { formatToIDR } from "@/lib/utils";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import toast from "react-hot-toast";
import { addToCartAction } from "./action";
import { TProductDetail } from "./query";
import { ChildrenProps } from "@/types";

const ProductDetailContext = createContext<{
  product: TProductDetail;
  counter: number;
  setCounter: Dispatch<SetStateAction<number>>;
} | null>(null);

const useProductDetailContext = () => {
  const ctx = useContext(ProductDetailContext);
  if (!ctx) {
    throw new Error(
      "useProductDetailContext must be used within a ProductDetailProvider"
    );
  }
  return ctx;
};

const ProductDetail = ({
  children,
  product,
}: ChildrenProps & { product: TProductDetail }) => {
  const [counter, setCounter] = useState(0);
  return (
    <ProductDetailContext.Provider value={{ product, counter, setCounter }}>
      <div className="flex items-start gap-6">{children}</div>
    </ProductDetailContext.Provider>
  );
};

function Description() {
  const { product } = useProductDetailContext();
  return (
    product.descriptionHtml && (
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />
    )
  );
}

ProductDetail.Price = function Price() {
  const { product } = useProductDetailContext();
  return (
    <div className="flex items-center gap-4 mt-4">
      <h2 className="font-bold text-2xl">
        {formatToIDR(product.price - (product.price * product.discount) / 100)}
      </h2>
      {product.discount > 0 && (
        <div className="flex items-center gap-x-4">
          <h2 className="font-bold line-through text-foreground/30 text-2xl">
            {formatToIDR(product.price)}
          </h2>
          <h2 className="font-bold text-destructive">{product.discount}%</h2>
        </div>
      )}
    </div>
  );
};

ProductDetail.Counter = function Counter() {
  const { setCounter, counter } = useProductDetailContext();
  return (
    <ButtonGroup>
      <Button
        onClick={() => {
          setCounter((val) => (val === 1 ? val : (val -= 1)));
        }}
        variant={"outline"}
        size={"icon-lg"}
      >
        <Minus />
      </Button>
      <Button size={"icon-lg"} variant={"outline"}>
        {counter}
      </Button>
      <Button
        onClick={() => {
          setCounter((val) => (val += 1));
        }}
        variant={"outline"}
        size={"icon-lg"}
      >
        <Plus />
      </Button>
    </ButtonGroup>
  );
};

ProductDetail.AddToCart = function AddToCart() {
  const router = useRouter();
  const { data } = useSession();
  const pathname = usePathname();

  const { counter, product } = useProductDetailContext();

  const addToCart = async () => {
    if (!data?.session) {
      router.push(`/auth/signin?callbackUrl=${pathname}`);
      return;
    }
    const result = await addToCartAction({
      productId: product.id,
      quantity: counter,
    });
    if (result.data) {
      toast.success("added to cart");
      return;
    }
    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }
    const ve = result.validationErrors;
    if (ve) {
      const pId = ve.productId?.[0];
      const q = ve.quantity?.[0];
      console.log({ pId, q });
    }
  };
  return (
    <Button onClick={addToCart}>
      <ShoppingCart />
      Add To Cart
    </Button>
  );
};

ProductDetail.Description = Description;
export default ProductDetail;
