"use client";

import { addCategoryAction } from "@/app/admin/products/add-category/action";
import { Minus, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

const max = 5;
const min = 1;

const initState = {
  cat1: "",
  cat2: "",
  cat3: "",
  cat4: "",
  cat5: "",
};

export default function AddCategoryForm() {
  const [state, setState] = useState(initState);
  const [counter, setCounter] = useState(min);
  const {
    executeAsync,
    result: { validationErrors: ve },
  } = useAction(addCategoryAction, {
    onError(args) {
      console.log(args);
    },
    onSuccess() {
      setState(initState);
    },
  });
  const cats = [state.cat1, state.cat2, state.cat3, state.cat4, state.cat5];
  const errors = [
    ve?.cat1?.[0],
    ve?.cat2?.[0],
    ve?.cat3?.[0],
    ve?.cat4?.[0],
    ve?.cat5?.[0],
  ];
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const action = async (fd: FormData) => {
    const result = await executeAsync(fd);
    if (result.data) {
      toast.success("new category added");
    }
  };
  return (
    <form action={action}>
      <Card>
        <CardContent>
          <FieldGroup>
            {Array.from({ length: counter }).map((_, i) => (
              <InputField
                name={`cat${i + 1}`}
                key={i}
                label={`Category ${i + 1}`}
                type="text"
                placeholder={`new category ${i + 1}`}
                onChange={handleChange}
                value={cats[i]}
                errorMessage={errors[i]}
              />
            ))}
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="outline"
                disabled={counter === max}
                onClick={() => setCounter((val) => (val += 1))}
              >
                <PlusIcon />
                More Category Field
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={counter === min}
                onClick={() => setCounter((val) => (val -= 1))}
              >
                <Minus />
                Remove Category Field
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <CardAction>
            <Button type="submit">Add Category</Button>
          </CardAction>
        </CardFooter>
      </Card>
    </form>
  );
}
