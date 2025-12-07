"use client";

import { InputField, TextareaField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import SelectOptions from "./select-options";
import { FormEvent, useEffect, useId, useState } from "react";
import { env } from "@/lib/env";
import { IdWithName, Shipping } from "@/app/api/shipping/types";
import toast from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatToIDR } from "@/lib/utils";

type Props = {
  weight: number;
};

export function CourierDialog({ weight }: Props) {
  const [provinces, setProvinces] = useState<IdWithName[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(
    null
  );
  const [cities, setCities] = useState<IdWithName[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [districts, setDistricts] = useState<IdWithName[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
    null
  );
  const [address, setAddress] = useState("");
  const [availableCouriers, setAvailableCouriers] = useState<Shipping[]>([]);

  useEffect(() => {
    fetch(`${env.nextPublicBaseUrl}/api/shipping?fetchType=provinces`)
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
      });
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      fetch(
        `${env.nextPublicBaseUrl}/api/shipping?fetchType=cities&provinceId=${selectedProvinceId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
        });
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedCityId) {
      fetch(
        `${env.nextPublicBaseUrl}/api/shipping?fetchType=districts&cityId=${selectedCityId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data);
        });
    }
  }, [selectedCityId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !selectedProvinceId ||
      !selectedCityId ||
      !selectedDistrictId ||
      address === ""
    ) {
      toast.error("Please complete the form");
      return;
    }
    localStorage.setItem(
      "address",
      JSON.stringify({
        province: provinces.find((p) => p.id === parseInt(selectedProvinceId)),
        city: cities.find((p) => p.id === parseInt(selectedCityId)),
        district: districts.find((p) => p.id === parseInt(selectedDistrictId)),
        address,
      })
    );
    const result = await fetch(`${env.nextPublicBaseUrl}/api/shipping`, {
      method: "POST",
      body: JSON.stringify({
        originId: 4247,
        destinationId: selectedDistrictId,
        weight,
      }),
    });
    const data = (await result.json()) as Shipping[];
    console.log(data);

    setAvailableCouriers(data);
  };

  useEffect(() => {
    if (selectedDistrictId) {
      console.log(selectedDistrictId);
    }
  }, [selectedDistrictId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Truck />
          Pick Courier
        </Button>
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur" />
      <DialogContent className="sm:max-w-md relative">
        <DialogTitle>Choose Courier</DialogTitle>
        <DialogDescription>
          Your order will be sent from Riau, Pekanbaru, Bukit Raya, 4247
        </DialogDescription>
        {availableCouriers.length > 0 ? (
          <CourierOptions options={availableCouriers} />
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="relative">
              <SelectOptions
                value={selectedProvinceId ?? ""}
                onValueChange={setSelectedProvinceId}
                label="Province"
                options={provinces}
              />
              <SelectOptions
                value={selectedCityId ?? ""}
                onValueChange={setSelectedCityId}
                label="City"
                options={cities}
              />
              <SelectOptions
                value={selectedDistrictId ?? ""}
                onValueChange={setSelectedDistrictId}
                label="District"
                options={districts}
              />
              <TextareaField
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                label="Address"
                placeholder="Enter your detail address here. Such as postal code, street, etc "
              />
              <Field>
                <Button className="w-full" type="submit" variant="default">
                  Next
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

type OptionsProps = {
  options: Shipping[];
};
const CourierOptions = ({ options }: OptionsProps) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={setValue} className="space-y-2">
        {options.map((o, i) => (
          <Option key={i} shipping={o} />
        ))}
      </RadioGroup>
      <Button
        className="w-full"
        onClick={() => {
          console.log(value);
        }}
      >
        Pick
      </Button>
    </div>
  );
};

const Option = ({ shipping }: { shipping: Shipping }) => {
  const id = useId();
  return (
    <div className="flex items-start gap-x-4">
      <RadioGroupItem value={JSON.stringify(shipping)} id={id} />
      <div>
        <Label htmlFor={id}>
          {shipping.name} ({shipping.service})
        </Label>
        <p className="text-sm font-light text-foreground/60">
          {shipping.description}
        </p>
        <p className="text-sm">
          {formatToIDR(shipping.cost)} &middot;{" "}
          <span className="italic">{shipping.etd}</span>
        </p>
      </div>
    </div>
  );
};
