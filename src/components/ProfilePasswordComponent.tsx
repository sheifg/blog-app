import { object, ref, string } from "yup";
import FormComponent from "../components/FormComponent";
import { useAuth } from "../context/AuthContext";
import { FormikHelpers } from "formik";

// Contains everything about password, necessary for the form
interface IPassword {
  currentPassword: string;
  password: string;
  password2: string;
}

const ProfilePasswordComponent = () => {
  // Provide fallback values in case user is null
  const initialValuesProfile = {
    currentPassword: "",
    password: "",
    password2: "",
  };
  // userInfo is the current user
  const { updateUser, userInfo } = useAuth();

  // Validation
  const profileSchema = object().shape({
    currentPassword: string().required("Current password is required!"),
    password: string()
      .min(8, "Min 8 characters")
      .required("Password is required!"),
    password2: string()
      .required("Password is required!")
      .oneOf([ref("password")], "Password does not match!"),
  });

  const handleSubmitProfile = (
    values: IPassword,
    actions: FormikHelpers<IPassword>
  ) => {
    // Accessing the current user and taking all the info
    // The password is the necessary that it is necessary to use it and update it
    const data = { ...userInfo, password: values.password };
    // It works but TS complains about missmatch here, for that reason data is created and then used it
    // updateUser(values, 'Password changed successfully!');
    updateUser(data as IUser, "Password changed successfully!");
    actions.setSubmitting(false);
  };
  return (
    <FormComponent
      initialValues={initialValuesProfile}
      ValidationSchema={profileSchema}
      handleSubmit={handleSubmitProfile}
      title="Update Password"
      inputs={[
        {
          name: "currentPassword",
          inputType: "password",
          label: "Current Password",
        },
        {
          name: "password",
          inputType: "password",
          label: "New Password",
        },
        {
          name: "password2",
          inputType: "password",
          label: "Confirm New Password",
        },
      ]}
      buttonText="Update Password"
    />
  );
};

export default ProfilePasswordComponent;
