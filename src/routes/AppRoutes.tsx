import { Route, Routes } from "react-router-dom";
import {
  AddOrEditBlog,
  Details,
  Home,
  Login,
  Profile,
  Register,
} from "../pages";
import PrivateRouter from "./PrivateRoute";

// If you want to have the same layout for different pages in your app, but not in all, you have 2 options:
// 1 - Wrapping all components with the component <Layout></Layout>
// 2 - Wrapping here the pages that you want to include the <Layout>
// This project is done with the option 1
const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      /> */}
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/" element={<PrivateRouter />}>
        {/* <Route path="/" element={<Layout />} > */}
        {/* <AddOrEditBlog /> resuable for edit or add blog */}
        <Route path="/blog/add" element={<AddOrEditBlog />} />
        <Route path="/blog/edit/:id" element={<AddOrEditBlog />} />
        <Route path="/blog/details/:id" element={<Details />} />
        <Route path="/blog/profile" element={<Profile />} />
        {/* </Route> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
