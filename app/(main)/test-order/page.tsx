"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = env.midtransPublicClientKey;
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.async = true;
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const pay = async () => {
    try {
      window.snap.show();
      const data = await fetch(`${env.nextPublicBaseUrl}/api/midtrans?order_id=e07e5b8b-ebb2-4161-9b44-e099db711e27`);
      const result = await data.json();
      window.snap.pay(result.token, {
        // embedId: "",
        onSuccess: function (result: any) {
          console.log("Success", result);
        },
        onPending: function (result: any) {
          console.log("Pending", result);
        },
        onError: function (result: any) {
          console.log(result);
        },
      });
    } catch (error) {
      window.snap.hide();
    }
  };

  return (
    <div>
      <Button onClick={pay}>Pay</Button>
    </div>
  );
}
