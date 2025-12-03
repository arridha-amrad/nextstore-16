"use client";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import Form from "next/form";
import { useRef } from "react";

export default function NavbarSearch() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form className="w-full" action={"/"}>
      <InputGroup>
        <InputGroupInput
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              formRef.current?.submit();
            }
          }}
          name="search"
          placeholder="Enter product name..."
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
}
