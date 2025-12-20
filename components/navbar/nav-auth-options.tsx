import { getServerSession } from "@/lib/auth";
import {
  NavbarAuthButtons,
  NavbarUserDropDown,
} from "./navbar-client-components";

export default async function NavAuthOptions() {
  const session = await getServerSession();

  if (session) {
    return <NavbarUserDropDown user={session.user} />;
  }

  return <NavbarAuthButtons />;
}
