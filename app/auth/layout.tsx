import Footer from "@/components/footer";
import { ChildrenProps } from "@/types";
import { GalleryVerticalEnd } from "lucide-react";
import { Suspense } from "react";

export default function AuthLayout({ children }: ChildrenProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 bg-[url('/bg.jpg')] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="flex w-full justify-center flex-1 max-w-sm flex-col gap-6">
        <div className="flex text-foreground items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          NextStore
        </div>
        {children}
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
}
