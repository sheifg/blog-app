import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import FormComponent from "../components/FormComponent";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const initialValues = {
    email: "",
    password: "",
  };

  const { login } = useAuth();
  const navigate = useNavigate();

  //! Formik has always initialValues and validationSchema

  // validation Schema
  const loginSchema = object().shape({
    email: string().email("Invalid Email").required("Email is required!"),
    password: string()
      .min(8, "Min 8 characters")
      .required("Password is required!"),
  });

  // handleSubmit in Formik
  // https://formik.org/docs/api/formik
  // @ts-ignore:next-line
  const handleSubmit = (values, actions) => {
    console.log(values);
    login(values, navigate);
    // setSubmitting from formik to finish the submit
    actions.setSubmitting(false);
  };

  return (
    <section className="flex items-center min-h-screen">
      <img
        src="https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
        className="hidden lg:block w-7/12 h-screen object-cover"
        alt="login page image"
      />

      <FormComponent
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        ValidationSchema={loginSchema}
        title="Login"
        // It can be  written the inputs here or outside, it is better outside as it is done in Register.tsx
        inputs={[
          {
            name: "email",
            label: "Email",
            inputType: "email",
          },
          {
            name: "password",
            label: "Password",
            inputType: "password",
          },
        ]}
        buttonText="Login"
        bottomText1="Don't have an account?"
        bottomText2="Register"
        bottomLink="/auth/register"
      />
    </section>
  );
}
