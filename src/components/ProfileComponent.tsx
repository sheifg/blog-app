import { object, string } from "yup";
import FormComponent from "../components/FormComponent";
import { useAuth } from "../context/AuthContext";
import { FormikHelpers } from "formik";

const ProfileComponent = () => {
  // Safely retrieve and parse the user object from localStorage
  // const storedUser = localStorage.getItem('user');
  // console.log(storedUser);
  // let user: currentUserInterface | null = null;

  // if (storedUser) {
  //   try {
  //     const parsedUser = JSON.parse(storedUser);
  //     user = parsedUser || null; // Access the user object, fallback to null
  //     console.log(user);
  //   } catch (error) {
  //     console.error('Error parsing user from localStorage:', error);
  //     user = null; // In case of parsing error, fallback to null
  //   }
  // }

  // To get the current user information from context
  const { userInfo: user, updateUser } = useAuth();
  // Update the current user info from context
  //  const { updateUser } = useAuth();

  // Provide fallback values in case user is null
  // username and the rest of initial values comes from the user that there is in the context
  const initialValuesProfile = {
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  };

  // Validation
  const profileSchema = object().shape({
    username: string().required("Username is required!"),
    email: string().email("Invalid Email").required("Email is required!"),
    firstName: string().required("First name is required!"),
    lastName: string().required("Last name is required!"),
  });

  const handleSubmitProfile = (
    values: IUser,
    actions: FormikHelpers<IUser>
  ) => {
    // console.log(values);
    updateUser(values, "Profile updated successfully!");
    actions.setSubmitting(false);
  };
  return (
    <FormComponent
      initialValues={initialValuesProfile}
      ValidationSchema={profileSchema}
      handleSubmit={handleSubmitProfile}
      title="Profile"
      inputs={[
        {
          name: "username",
          label: "Username",
          inputType: "text",
        },
        {
          name: "email",
          label: "Email",
          inputType: "email",
        },
        {
          name: "firstName",
          label: "First Name",
          inputType: "text",
        },
        {
          name: "lastName",
          label: "Last Name",
          inputType: "text",
        },
      ]}
      buttonText="Update Profile"
    />
  );
};

export default ProfileComponent;
