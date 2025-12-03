import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { getServerSession } from "./auth";
import { unauthorized } from "next/navigation";

export class MyCustomError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError: (err) => {
    if (err instanceof MyCustomError) {
      return err.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession();
  if (!session) {
    return unauthorized();
  }
  return next({ ctx: { userId: session.user.id } });
});
