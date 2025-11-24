import LogoutButton from "@/components/buttons/logout.button";
import { getServerSession } from "@/lib/auth";

export default async function RootPage() {
  const session = await getServerSession();

  return (
    <main className="container mx-auto">
      <h1>Hello {session?.user.name ?? ""}</h1>
      {session && <LogoutButton />}
    </main>
  );
}
