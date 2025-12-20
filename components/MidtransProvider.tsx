"use client"

import { env } from "@/lib/env";
import { useEffect } from "react";

export default function MidtransProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = env.midtransPublicClientKey;
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return <>{children}</>;
}