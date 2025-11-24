import z from "zod";

const passwordSchema = z
  .string()
  .min(1, { error: "required" })
  .min(5, { error: "minimal 5 characters" })
  .regex(/[a-z]/, { error: "require lowercase" })
  .regex(/[A-Z]/, { error: "require uppercase" })
  .regex(/[0-9]/, { error: "require number" });

const emailSchema = z.email({ error: "Invalid email address" });

export const signupSchema = z
  .object({
    name: z.string().min(1, { error: "required" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Password do not match",
  });

export const signinSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Password do not match",
  });

export const addProductSchema = z.object({
  title: z.string().min(1, "title required"),
  stock: z.number().gt(0, "must greater than 0"),
  price: z.number().gt(0, "must greater than 0"),
  discount: z.number().min(0, "min 0").max(100, "max 100"),
  description: z.string().min(1, "description is required"),
  category: z.string().min(1, "category is required"),
  images: z
    .array(z.url("must be an url"))
    .min(1, "at least an image is required"),
});
