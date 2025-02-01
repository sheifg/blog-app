import { Form, Formik, FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import InputComponent from "../components/InputComponent";
import * as Yup from "yup";

// Define the type for individual input field props
interface IInput {
  name: string;
  label: string;
  inputType?: string;
  placeholder?: string;
}

// Define the props interface
interface IFormComponentProps<T> {
  handleSubmit: (
    values: T, // Every form will have a different structure for value, so it is used T
    // Type of form comes directly from formik
    // It should be generic because it is not known what structure for values will have
    formikHelpers: FormikHelpers<T>
  ) => void | Promise<void>;
  initialValues: T;
  // <any> is not a good thing, but sometimes it is had to use, like here, becasue it covers any cases posibles in validation squema
  ValidationSchema: Yup.ObjectSchema<any>;
  title: string;
  // IInput defined above
  inputs: IInput[];
  buttonText: string;
  bottomLink?: string;
  bottomText1?: string;
  bottomText2?: string;
}

// Type of component -> T extends object: part from an object and extends it. It is written so
// Type of props -> IFormComponentProps, it is necessary to include the type pf thr props as <T>
// It is not known the type of the object, because it is generic, it is necessary to extend the object. It forces at least that the generics will be an object
const FormComponent = <T extends object>({
  handleSubmit,
  initialValues,
  ValidationSchema,
  title,
  inputs,
  buttonText,
  bottomText1,
  bottomText2,
  bottomLink,
}: IFormComponentProps<T>) => {
  return (
    <div className="w-full max-w-sm p-8 mx-auto bg-white border border-gray-200 rounded-lg shadow">
      <Formik
        // Takes 3 parameters:
        // initial values, validation schema and onsubmit
        // validation squema is optional
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={ValidationSchema}
      >
        {({ errors, touched }) => (
          <Form className="space-y-5">
            <h5 className="text-3xl text-center font-bold text-gray-500">
              {title}
            </h5>

            {inputs.map((input) => (
              <InputComponent
                key={input.name}
                errors={errors}
                touched={touched}
                label={input.label}
                name={input.name as keyof T}
                inputType={input.inputType}
                placeholder={input.placeholder}
              />
            ))}

            <div className="flex flex-col justify-center items-center space-y-4">
              <button type="submit" className="btn-primary">
                {buttonText}
              </button>
            </div>
            {/* This part is optional, it doesnt exist in all register/login forms */}
            {bottomText1 && (
              <p className="text-sm font-medium text-gray-500">
                {/* {' '} to create a space between the both text: bottomText1 and bottomLink1 */}
                {bottomText1}{" "}
                <Link
                  to={bottomLink as string}
                  className="text-blue-700 hover:underline"
                >
                  {bottomText2}
                </Link>
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormComponent;
