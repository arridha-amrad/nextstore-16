export type IdWithName = {
  id: number;
  name: string;
};

export type Shipping = {
  code: string; // lion
  cost: number; // 46000
  description: string; // Regular Service
  etd: string; // 5-7 day
  name: string; // Lion Parcel
  service: string; // REGPACK
};

export type Address = {
  province: string;
  city: string;
  district: string;
  address: string;
  phoneNumber: string;
  fullname: string;
  postalCode: string;
};
