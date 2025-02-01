import Layout from "../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useBlogContext } from "../context/BlogContext";
import { object, string } from "yup";
import { Field, Form, Formik } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import InputComponent from "../components/InputComponent";
import { IBlogForm } from "../types";

const AddOrEditBlog = () => {
  const navigate = useNavigate();
  // Get the state used in navigate in Card component
  const { state } = useLocation();

  // Blog functions
  const { createBlog, updateBlog, categories /* DAMI=[] */, getCategories } =
    useBlogContext();

  const [blog, setBlog] = useState<IBlogForm>({
    title: "",
    content: "",
    image:
      "https://www.timsahajans.com.tr/data/uploads/Blog-Nedir-Cesitleri-Nelerdir.jpg",
    categoryId: "",
  });

  // There are 2 options:
  // - using context (used in Details.tsx)
  // - using useLocation
  const [isEditMode, setIsEditMode] = useState(false);
  // Alternatively this state can be had from the store

  useEffect(() => {
    // Fetch categories when the component mounts
    // To select the categories, first it is necessary to get all the categories
    getCategories();

    // If there's state (editing mode), update blog state and set edit mode
    if (state) {
      setBlog({
        // state is the blog, sending as state from Card.tsx in the part Edit button
        // Using destructuring, it is just being used the things that they are needed
        title: state.title,
        content: state.content,
        image: state.image,
        // Spread the state it is being spreaded all the things
        // ...state,
        categoryId: state.categoryId._id,
      });

      setIsEditMode(true);
    }
  }, [state, getCategories]); // Runs on component mount or when state changes

  // Initial values comes from the state, and maybe it is need some time to have it, not come inmediately
  const initialValues = blog;

  const validationSchema = object({
    title: string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters long"),
    content: string().required("Content is required"),
    image: string().url("Invalid URL").required("Image URL is required"),
    categoryId: string().required("Category is required"),
  });

  const handleSubmit = (
    values: IBlogForm,
    { setSubmitting }: FormikHelpers<IBlogForm>
  ) =>
    // It is being used destructuring, because it is just needed setBumitting, for that reason the line above
    // It can also be done it, without destructuring as follow:
    // actions: FormikHelpers<IBlogForm>
    {
      if (!isEditMode) {
        createBlog(values, navigate);
      } else {
        updateBlog(values, navigate, state._id);
      }
      // Function from formik, after a successfully submit it should made avaiable the form again, making it false again. If it is doesn't do that, the form can stack
      setSubmitting(false);
      // actions.setSubmitting(false);
    };

  return (
    <Layout>
      <div className="w-full mx-auto p-6 max-w-[450px] md:max-w-[900px] bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-2xl text-center text-gray-800 mb-8">
          {isEditMode ? "EDIT" : "ADD"} POST
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          // If initial values are updated then the form will be reinitialized
          enableReinitialize // This allows Formik to reinitialize the form when `initialValues` changes
        >
          {/* It is coming from the formik. Whenenever there is an input, it is necessary to check the error handling */}
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <InputComponent
                errors={errors}
                touched={touched}
                label="Blog Title"
                name="title"
                inputType="text"
                placeholder="Enter a blog title"
              />

              <div className="my-4">
                <label htmlFor="categoryId" className="form-label">
                  Category:
                </label>
                <Field
                  as="select"
                  name="categoryId"
                  id="categoryId"
                  className="form-control"
                >
                  {/* Dropdown menu options */}
                  <option value="">Select Category</option>
                  {/* Looping over the categories and for each category creating an option to have the drop down menu */}
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.categoryId && touched.categoryId ? (
                  <div className="text-red-500 text-sm">
                    {errors.categoryId}
                  </div>
                ) : null}
              </div>
              {/* Intead of doing like this, there are a lot of libraries that include editor components to do it. The most famous one is CKEditor */}
              {/* <InputComponent
                errors={errors}
                touched={touched}
                label="Content"
                name="content"
                inputType="textarea"
                placeholder="Enter a content"
              /> */}
              <div className="my-4">
                <label className="form-label">Post Content:</label>
                {/* CKEditor: https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/quick-start.html */}
                <CKEditor
                  editor={ClassicEditor}
                  // ckeditor is not working with value
                  // Instead it is necessary to use data props for value
                  // If there is a blog, show the content of that. If not, nothing
                  data={blog ? blog.content : ""}
                  // It is not necessary the first parameter for that reason it is used: _
                  onChange={(_, editor) => {
                    // To update the state it can't be used e.target.value
                    const data = editor.getData();
                    // It is necessary to update the content state
                    // To update it there is function coming from formik
                    // That function is setFieldValue
                    // Normally formik updates the state automatically, but ckeditor is complety different, so it is necessary to do it using setFieldValue
                    setFieldValue("content", data);
                  }}
                />
                {errors.content && touched.content ? (
                  <div className="text-red-500 text-sm">{errors.content}</div>
                ) : null}
              </div>

              <InputComponent
                errors={errors}
                touched={touched}
                label="Image URL"
                name="image"
                inputType="url"
                placeholder="https://image.com"
              />

              <div className="my-4 flex justify-center">
                <button className="btn-primary" type="submit">
                  {isEditMode ? "EDIT" : "ADD"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default AddOrEditBlog;
