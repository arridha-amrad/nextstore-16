"use client";

import { Address, IdWithName, Shipping } from "@/app/api/shipping/types";
import { InputField, TextareaField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { env } from "@/lib/env";
import { formatToIDR } from "@/lib/utils";
import { Truck } from "lucide-react";
import { FormEvent, useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import SelectOptions from "./SelectOptions";
import { useSession } from "@/lib/auth-client";

type Props = {
  weight: number;
  setAddressCallback: (v: Address) => void;
  setShippingCallback: (v: Shipping) => void;
};

export default function ShippingDialog({ weight, setAddressCallback, setShippingCallback }: Props) {
  const { data } = useSession();
  const [provinces, setProvinces] = useState<IdWithName[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [cities, setCities] = useState<IdWithName[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [districts, setDistricts] = useState<IdWithName[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [availableCouriers, setAvailableCouriers] = useState<Shipping[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullname, setFullname] = useState(data?.user.name ?? "");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (data?.user) {
      setFullname(data.user.name);
    }
  }, [data?.user]);

  useEffect(() => {
    fetch(`${env.nextPublicBaseUrl}/api/shipping?fetchType=provinces`)
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
      });
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      fetch(`${env.nextPublicBaseUrl}/api/shipping?fetchType=cities&provinceId=${selectedProvinceId}`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
        });
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedCityId) {
      fetch(`${env.nextPublicBaseUrl}/api/shipping?fetchType=districts&cityId=${selectedCityId}`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data);
        });
    }
  }, [selectedCityId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProvinceId || !selectedCityId || !selectedDistrictId || address === "") {
      toast.error("Please complete the form");
      return;
    }
    setAddressCallback({
      province: provinces.find((p) => p.id === parseInt(selectedProvinceId))?.name ?? "",
      city: cities.find((p) => p.id === parseInt(selectedCityId))?.name ?? "",
      district: districts.find((p) => p.id === parseInt(selectedDistrictId))?.name ?? "",
      address,
      phoneNumber,
      fullname,
      postalCode,
    });
    const result = await fetch(`${env.nextPublicBaseUrl}/api/shipping`, {
      method: "POST",
      body: JSON.stringify({
        originId: 4247,
        destinationId: selectedDistrictId,
        weight,
      }),
    });
    const data = (await result.json()) as Shipping[];
    setAvailableCouriers(data);
  };

  useEffect(() => {
    if (selectedDistrictId) {
      console.log(selectedDistrictId);
    }
  }, [selectedDistrictId]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Truck />
          Pick Courier
        </Button>
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur" />
      <DialogContent className="sm:max-w-md relative">
        <DialogHeader>
          <DialogTitle>Choose Courier</DialogTitle>
          <DialogDescription>
            Your order will be sent from Riau, Pekanbaru, Bukit Raya, 4247
          </DialogDescription>
        </DialogHeader>
        {availableCouriers.length > 0 ? (
          <CourierOptions
            setShippingCallback={setShippingCallback}
            close={() => setOpen(false)}
            options={availableCouriers}
          />
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
              <div className="flex items-start gap-x-4">
                <InputField
                  label="Name"
                  placeholder="John doe"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <InputField
                  label="Phone number"
                  placeholder="081211223344"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <InputField
                label="Postal Code"
                placeholder="28288"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
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
  close: VoidFunction;
  setShippingCallback: (v: Shipping) => void;
};
const CourierOptions = ({ options, close, setShippingCallback }: OptionsProps) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="space-y-4 mt-6">
      <RadioGroup value={value} onValueChange={setValue} className="space-y-2">
        {options.map((o, i) => (
          <Option key={i} shipping={o} />
        ))}
      </RadioGroup>
      <Button
        className="w-full mt-6"
        onClick={() => {
          if (value) {
            setShippingCallback(JSON.parse(value));
          }
          close();
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
      <div className="space-y-1">
        <Label htmlFor={id}>
          {shipping.name} ({shipping.service})
        </Label>
        <p className="text-sm font-light text-foreground/60">{shipping.description}</p>
        <p className="text-sm">
          {formatToIDR(shipping.cost)} &middot; <span className="italic">{shipping.etd}</span>
        </p>
      </div>
    </div>
  );
};
