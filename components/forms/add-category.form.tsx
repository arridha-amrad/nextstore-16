"use client";

import { ChangeEvent, useState } from "react";
import { InputField } from "../input-field";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FieldGroup } from "../ui/field";
import { useAction } from "next-safe-action/hooks";
import { addCategoryAction } from "@/app/admin/products/add-category/action";
import toast from "react-hot-toast";
import { Minus, PlusIcon } from "lucide-react";

const max = 10;
const min = 1;

const initState = {
  cat1: "",
  cat2: "",
  cat3: "",
  cat4: "",
  cat5: "",
  cat6: "",
  cat7: "",
  cat8: "",
  cat9: "",
  cat10: "",
};

export default function AddCategoryForm() {
  const [state, setState] = useState(initState);
  const [counter, setCounter] = useState(min);
  const {
    execute,
    result: { validationErrors: ve },
  } = useAction(addCategoryAction, {
    onError(args) {
      console.log(args);
    },
    onSuccess: () => {
      toast.success("new category added");
      setState(initState);
    },
  });
  const cats = [
    state.cat1,
    state.cat2,
    state.cat3,
    state.cat4,
    state.cat5,
    state.cat6,
    state.cat7,
    state.cat8,
    state.cat9,
    state.cat10,
  ];
  const errors = [
    ve?.cat1?.[0],
    ve?.cat2?.[0],
    ve?.cat3?.[0],
    ve?.cat4?.[0],
    ve?.cat5?.[0],
    ve?.cat6?.[0],
    ve?.cat7?.[0],
    ve?.cat8?.[0],
    ve?.cat9?.[0],
    ve?.cat10?.[0],
  ];
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form action={execute}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Add Category</CardTitle>
        </CardHeader>
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
                More Image
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={counter === min}
                onClick={() => setCounter((val) => (val -= 1))}
              >
                <Minus />
                Remove Image
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
