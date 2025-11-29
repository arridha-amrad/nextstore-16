import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export class MyCustomError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError: (err) => {
    if (err instanceof MyCustomError) {
      return err.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
