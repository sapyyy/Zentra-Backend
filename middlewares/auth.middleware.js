const z = require("zod");

const newUser = z.object({
  email: z.string(),
  password: z
    .string()
    .min(6, "The password should be atleast 6 characters long"),
  firstName: z.string().min(1, "The first name can't be empty"),
  lastName: z.string().min(1, "The last name can't be empty"),
  role: z.enum([
    "visitor",
    "agency",
    "admin",
    "hotel-owner",
    "transport-owner",
  ]),
});
