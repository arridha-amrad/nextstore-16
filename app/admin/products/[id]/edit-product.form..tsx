"use client";

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
import { ProductModel } from "@/models/product.model";
import { LexicalEditor, SerializedEditorState } from "lexical";
import { Check, ChevronsUpDown, Minus, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Editor } from "@/components/blocks/editor-00/editor";
import SubmitButton from "@/components/buttons/submit.button";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { editProductAction } from "@/app/admin/products/[id]/action";

const maxImageField = 4;

type Props = {
  categories: ProductCategory[];
  product: ProductModel;
};

export default function EditProductForm({ categories, product }: Props) {
  const [state, setState] = useState({
    name: product.name,
    category: product.category,
    discount: product.discount,
    price: product.price,
    stock: product.stock,
    image1: product.images[0],
    image2: product.images[1] ?? "",
    image3: product.images[2] ?? "",
    image4: product.images[3] ?? "",
  });

  const [categoryValue, setCategoryValue] = useState(product.category);

  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >(product.description.json && JSON.parse(product.description.json));

  const editorRef = useRef<LexicalEditor | null>(null);

  const [imgCounter, setImgCounter] = useState(
    product.images.length === 0 ? 1 : product.images.length
  );

  const [descriptionHtml, setDescriptionHtml] = useState(
    product.description.html ?? ""
  );

  const router = useRouter();

  useEffect(() => {
    if (categoryValue !== "") {
      setState({
        ...state,
        category: categoryValue,
      });
    }
  }, [categoryValue]);

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
    executeAsync,
    result: { validationErrors: ve },
    isPending,
  } = useAction(editProductAction.bind(null, product.id), {
    onError(args) {
      if (args.error.serverError) {
        toast.error(args.error.serverError);
      }
    },
  });

  const images = [state.image1, state.image2, state.image3, state.image4];
  const errors = [
    ve?.image1?.[0],
    ve?.image2?.[0],
    ve?.image3?.[0],
    ve?.image4?.[0],
  ];

  const action = async (fd: FormData) => {
    fd.append("category", state.category);
    fd.append("descriptionJson", JSON.stringify(editorState));
    fd.append("descriptionHtml", descriptionHtml);
    const result = await executeAsync(fd);
    if (result.data) {
      toast.success("updated");
      router.refresh();
    }
  };

  return (
    <form action={action}>
      <Card>
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
            <Editor
              editorRef={editorRef}
              htmlSetter={setDescriptionHtml}
              editorSerializedState={editorState}
              onSerializedChange={(value) => setEditorState(value)}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <CardAction>
            <SubmitButton isLoading={isPending} label="Edit Product" />
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
}: Omit<Props, "product"> & {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);

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
