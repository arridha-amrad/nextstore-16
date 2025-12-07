import { env } from "@/lib/env";
import { Shipping } from "./types";
import { NextRequest, NextResponse } from "next/server";

const rajaOngkirUrl = "https://rajaongkir.komerce.id/api/v1/destination";
const key = env.rajaOngkirApiKey as string;

type FetchType = "provinces" | "cities" | "districts";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const params = new URLSearchParams();
  params.append("origin", body.originId);
  params.append("destination", body.destinationId);
  params.append("weight", body.weight);
  params.append(
    "courier",
    "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse"
  );
  params.append("price", "lowest");

  const res = await fetch(
    "https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost",
    {
      headers: {
        key: key,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params,
      method: "POST",
    }
  );
  const data = await res.json();
  const options = (data.data as Shipping[]).slice(0, 5);
  return NextResponse.json(options, { status: 200 });
};

export const GET = async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const fetchType = sp.get("fetchType") as FetchType | null;
  let url = "";

  if (!fetchType) {
    return makeResponse(400, "please include fetch type on query params");
  }

  switch (fetchType) {
    case "provinces":
      url = `${rajaOngkirUrl}/province`;
    case "cities":
      const provinceId = sp.get("provinceId");
      if (provinceId) {
        url = `${rajaOngkirUrl}/city/${provinceId}`;
      }
    case "districts":
      const cityId = sp.get("cityId");
      if (cityId) {
        url = `${rajaOngkirUrl}/district/${cityId}`;
      }
  }

  if (url === "") {
    return makeResponse(400, "empty string url is not allowed");
  }

  const res = await fetch(url, {
    cache: "force-cache",
    headers: {
      "Content-Type": "application/json",
      Key: key,
    },
  });
  const data = await res.json();

  return NextResponse.json(data.data, { status: 200 });
};

const makeResponse = (status: number, message: string) => {
  return NextResponse.json(
    {
      message,
    },
    { status }
  );
};
