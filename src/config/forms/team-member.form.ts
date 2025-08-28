import * as z from "zod";

export const login_form_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginForm = z.infer<typeof login_form_schema>;
