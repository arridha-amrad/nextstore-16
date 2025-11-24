"use client";

import { useAppForm } from "@/hooks/form/useFormHooks";
import { addProductSchema } from "@/lib/schema.zod";
import { Minus, Plus } from "lucide-react";
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

export default function AddProductForm() {
  const form = useAppForm({
    defaultValues: {
      title: "",
      stock: 0,
      price: 0,
      discount: 0,
      description: "",
      category: "",
      images: [""] as string[],
    },
    validators: {
      onSubmit: addProductSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      console.log(value);
      formApi.reset();
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form.AppField
              name="title"
              children={(f) => (
                <f.TextField
                  placeholder="GIGABYTE GeForce RTX 5090 32GB"
                  label="Product's Title"
                />
              )}
            />
            <form.AppField
              name="category"
              children={(field) => (
                <field.TextField label="Category" placeholder="vga" />
              )}
            />
            <div className="flex items-start gap-4">
              <form.AppField
                name="price"
                children={(f) => (
                  <f.NumberField placeholder="5" label="Price" type="number" />
                )}
              />
              <form.AppField
                name="stock"
                children={(f) => (
                  <f.NumberField placeholder="5" label="Stock" type="number" />
                )}
              />
              <form.AppField
                name="discount"
                children={(f) => (
                  <f.NumberField
                    placeholder="10"
                    label="Discount"
                    type="number"
                  />
                )}
              />
            </div>
            <div className="flex items-start gap-4">
              <form.AppField name="images" mode="array">
                {(field) => {
                  return (
                    <div className="space-y-2 w-full">
                      {field.state.value.map((_, i) => {
                        return (
                          <div key={i} className="flex items-end gap-4">
                            <form.AppField name={`images[${i}]`}>
                              {(subField) => {
                                return (
                                  <subField.TextField
                                    label={`Image ${i + 1}`}
                                    placeholder="url"
                                  />
                                );
                              }}
                            </form.AppField>
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => field.pushValue("")}
                          type="button"
                        >
                          <Plus className="size-4" />
                          More Image
                        </Button>
                        <Button
                          disabled={field.state.value.length === 1}
                          variant={"outline"}
                          onClick={() =>
                            field.removeValue(field.state.value.length - 1)
                          }
                          type="button"
                        >
                          <Minus className="size-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </form.AppField>
            </div>
            <form.AppField
              name="description"
              children={(f) => (
                <f.TextareaField
                  label="Product's Description"
                  placeholder="Enter product description here."
                />
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <CardAction>
            <form.AppForm>
              <form.SubmitButton label="Add Product" />
            </form.AppForm>
          </CardAction>
        </CardFooter>
      </Card>
    </form>
  );
}
