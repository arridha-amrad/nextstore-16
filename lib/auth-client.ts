import { createAuthClient } from "better-auth/react";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} = createAuthClient();
