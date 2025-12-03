"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function Quantity() {
  const [counter, setCounter] = useState(1);
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
}

export function AddToCartButton() {
  return (
    <Button>
      <ShoppingCart />
      Add To Cart
    </Button>
  );
}
