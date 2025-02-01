import { Field } from "formik";
import { FormikErrors, FormikTouched } from "formik";

interface IInputComponentProps<T> {
  // T generics, because it is not known the shape of the errors
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  name: keyof T; // The name corresponds to a key in the form values(object only contains T)
  label: string;
  inputType?: string;
  placeholder?: string;
}

// It is not known the type of the object, because it is generic, it is necessary to extend the object. It forces at least that the generics will be an object
const InputComponent = <T extends object>({
  errors,
  touched,
  label,
  name,
  inputType = "text",
  placeholder,
}: IInputComponentProps<T>) => {
  return (
    <div>
      {/* htmlFor: attribute for HTML, when you click the label, the autofocus(it is like a for label in JS) */}
      <label htmlFor={name as string} className="form-label">
        {label}:
      </label>
      <Field
        type={inputType}
        name={name as string}
        id={name as string} // id name is the props of html elements. It is used name as string, because there is no id
        placeholder={placeholder}
        // form-control here is just for styling
        className="form-control"
      />
      {errors[name] && touched[name] && (
        <p className="mt-1 text-red-500 text-xs">{errors[name] as string}</p>
      )}
    </div>
  );
};

export default InputComponent;
