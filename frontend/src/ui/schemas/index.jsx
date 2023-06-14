import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Organization Name"),
  email: Yup.string().email().required("Please enter your email"),

});