"use client";

import { addProductAction } from "@/app/admin/products/add-product/action";
import { Check, ChevronsUpDown, Minus, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import * as React from "react";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { InputField, TextareaField } from "../input-field";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldGroup } from "../ui/field";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductCategory } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Label } from "../ui/label";
import SubmitButton from "../buttons/submit.button";

const maxImageField = 4;

type Props = {
  categories: ProductCategory[];
};

const initState = {
  name: "",
  category: "",
  stock: 0,
  price: 0,
  discount: 0,
  description: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
};

export default function AddProductForm({ categories }: Props) {
  const [state, setState] = useState(initState);
  const [categoryValue, setCategoryValue] = useState("");

  React.useEffect(() => {
    if (categoryValue !== "") {
      setState({
        ...state,
        category: categoryValue,
      });
    }
  }, [categoryValue]);

  const [imgCounter, setImgCounter] = useState(1);
  const addMoreImageField = () => {
    setImgCounter((val) => (val += 1));
  };
  const popImageField = () => {
    setImgCounter((val) => (val -= 1));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const {
    execute,
    result: { validationErrors: ve },
    isPending,
  } = useAction(addProductAction, {
    onError(args) {
      console.log(args);
      if (args.error.serverError) {
        toast.error(args.error.serverError);
        return;
      }
    },
    onSuccess() {
      setState(initState);
      toast.success("added", { className: "bg-background text-foreground" });
    },
  });
  const images = [state.image1, state.image2, state.image3, state.image4];
  const errors = [
    ve?.image1?.[0],
    ve?.image2?.[0],
    ve?.image3?.[0],
    ve?.image4?.[0],
  ];
  return (
    <form
      action={(fd) => {
        fd.append("category", state.category);
        execute(fd);
      }}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <InputField
              label="Name"
              type="text"
              placeholder="GIGABYTE GeForce RTX 5090 32GB"
              name="name"
              onChange={handleChange}
              value={state.name}
              errorMessage={ve?.name && ve.name[0]}
            />
            <CategoryCombobox
              value={categoryValue}
              setValue={setCategoryValue}
              categories={categories}
            />
            <div className="flex items-start gap-4">
              <InputField
                label="Price (Rp)"
                type="number"
                placeholder="50000"
                name="price"
                onChange={handleChange}
                value={state.price}
                errorMessage={ve?.price && ve.price[0]}
              />
              <InputField
                label="Stock (units)"
                type="number"
                placeholder="100"
                name="stock"
                onChange={handleChange}
                value={state.stock}
                errorMessage={ve?.stock && ve.stock[0]}
              />
              <InputField
                label="Discount (%)"
                type="number"
                placeholder="10%"
                name="discount"
                onChange={handleChange}
                value={state.discount}
                errorMessage={ve?.discount && ve.discount[0]}
              />
            </div>
            {[...Array(imgCounter)].fill("").map((_, i) => (
              <InputField
                key={i}
                label={`Image ${i + 1}`}
                type="text"
                placeholder="https://m.media-amazon.com/images/I/71ysm1UlqaL._AC_SL1500_.jpg"
                name={`image${i + 1}`}
                onChange={handleChange}
                value={images[i]}
                errorMessage={errors[i]}
              />
            ))}
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="outline"
                disabled={imgCounter === maxImageField}
                onClick={addMoreImageField}
              >
                <PlusIcon />
                More Image
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={imgCounter === 1}
                onClick={popImageField}
              >
                <Minus />
                Remove Image
              </Button>
            </div>
            <TextareaField
              label="Description"
              name="description"
              placeholder="Enter product description here."
              value={state.description}
              onChange={(e) => {
                setState((v) => ({
                  ...v,
                  description: e.target.value,
                }));
              }}
              errorMessage={ve?.description && ve.description[0]}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <CardAction>
            <SubmitButton isLoading={isPending} label="Add Product" />
          </CardAction>
        </CardFooter>
      </Card>
    </form>
  );
}

export function CategoryCombobox({
  categories,
  setValue,
  value,
}: Props & {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Field>
      <Label>Category</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !!value ? "text-foreground" : "text-foreground/50"
            )}
          >
            {value
              ? categories.find((c) => c.title === value)?.title
              : "Select framework..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="p-0 w-(--radix-popover-trigger-width)"
        >
          <Command>
            <CommandInput
              placeholder="Search framework..."
              className="h-9 w-full"
            />
            <CommandList>
              <CommandEmpty>
                No category found.&nbsp;
                <Link
                  className="underline underline-offset-4"
                  href="/admin/products/add-category"
                >
                  Create new
                </Link>
              </CommandEmpty>
              <CommandGroup>
                {categories.map((c, i) => (
                  <CommandItem
                    key={i}
                    value={c.title}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {c.title}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === c.title ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
