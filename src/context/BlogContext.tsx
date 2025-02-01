import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants";
import {
  IBlog,
  IBlogCategory,
  IBlogCategoryResponse,
  IBlogForm,
  IBlogs,
  IPaginationData,
  ISingleBlog,
  ISingleBlogResponse,
} from "../types";

// Define interfaces for posts and comments

interface IBlogContext {
  getBlog: (id: string) => Promise<void>;
  getBlogs: () => Promise<void>;
  createBlog: (
    data: IBlogForm,
    navigate: (path: string) => void
  ) => Promise<void>;
  addComment: (id: string, content: string) => Promise<void>;
  deleteBlog: (id: string, navigate: (path: string) => void) => Promise<void>;
  addLike: (id: string) => Promise<void>;
  updateBlog: (
    data: IBlogForm,
    navigate: (path: string) => void,
    id: string
  ) => Promise<void>;
  currentBlog: ISingleBlog | null;
  blogs: IBlog[];
  categories: IBlogCategory[];
  getCategories: () => Promise<void>;
  paginationData: IPaginationData;
  page: number;
  setPage: Dispatch<SetStateAction<number>>; // Corrected type
}

// 1 - Create a context
// There are 2 options to create it in TypeScript:
// - Option 1 - As it is done in AuthContext
// const AuthContext = createContext<IAuthContext | undefined>(undefined);
// I will create the context later with this syntax
// - Option 2 - using the following syntax, it is also defining all the types of the context
// This syntax is better than to have undefined
const BlogContext = createContext<IBlogContext>({
  getBlog: async () => {},
  getBlogs: async () => {},
  createBlog: async () => {},
  addComment: async () => {},
  deleteBlog: async () => {},
  addLike: async () => {},
  updateBlog: async () => {},
  currentBlog: null,
  blogs: [],
  categories: [],
  getCategories: async () => {},
  paginationData: {} as IPaginationData,
  page: 1,
  setPage: () => {},
});

// 2 - Create a provider and specify what kind of props use
//const baseUrl = 'https://33000.fullstack.clarusway.com';
export const BlogProvider = ({ children }: { children: ReactNode }) => {
  // Needed for the details page, it is just one single blog
  const [currentBlog, setCurrentBlog] = useState<ISingleBlog | null>(null);
  // Initially will be an empty array
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  // Initially will be an empty array
  const [categories, setCategories] = useState<IBlogCategory[]>([]);

  // This for pagination
  // The page 1 is being assigned as default
  const [page, setPage] = useState<number>(1);
  const [paginationData, setPaginationData] = useState<IPaginationData>({
    count: 0,
    next: false,
    previous: false,
    totalPages: 0,
  });

  // This part is for pagination
  // When any page is clicked in the pagination, it is necessary to get the blogs with that page
  // Whenever the pages is updated (pagination, goes to another page), the blogs are needed
  useEffect(() => {
    if (page) {
      getBlogs(page);
    }
  }, [page]);

  // Get all posts
  const getBlogs = async (page?: number) => {
    // let url = `${BASE_URL}/blogs/?limit=10`;
    // if (page) {
    //   url = `${BASE_URL}/blogs/?limit=10&page=${page}`;
    // }
    // If page is made as optional, it is necessary to create two url
    const url = page
      ? `${BASE_URL}/blogs/?limit=10&page=${page}`
      : `${BASE_URL}/blogs/`;
    try {
      // if it is not written, axios recognize it automatically
      // const { data } = await axios<IBlogs>(url);
      // <IBlogs> is optional to write it, because it is a future value, and ifit not written, the code doesn't break or block. But it is better to include it
      const { data } = await axios.get<IBlogs>(url);
      //console.log(data); // Log the response data to the console for debugging
      setBlogs(data.data);
      // The pagination is being shapped here
      setPaginationData({
        count: data.details?.totalRecords, // 41 blogs
        next: data.details?.pages.next, // if it is been in page2, next is 3
        previous: data.details?.pages.previous, // if it is been in page 2, previous is 1
        totalPages: Math.ceil(data.details?.totalRecords / 10), // if there are 41 blogs, total pages is 5
      });
      // There are 41 blogs. When pagination is used, all the blogs are not comming
      // In page 1, you there will be the blogs from 1 to 10 (we have limited of 10 blogs per page)
      // In page 2, you there will be the blogs from 11 to 20
      // In page 3, you there will be the blogs from 21 to 30
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Get a single post
  const getBlog = async (id: string) => {
    // It can be indcluded the token here or inside the try
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    try {
      const { data } = await axios.get<ISingleBlogResponse>(
        `${BASE_URL}/blogs/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            // 'Content-Type': 'application/json',
          },
        }
      );

      setCurrentBlog(data.data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Create Post
  const createBlog = async (
    data: IBlogForm,
    navigate: (path: string) => void
  ) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;

    console.log(data);
    console.log(token);
    try {
      await axios.post(`${BASE_URL}/blogs/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          // 'Content-Type': 'application/json',
        },
      });
      toast.success("Blog created successfully!");
      navigate("/");
      // Creating a single blog in a different page from home
      // When coming back to the home page, it will automatically update the blog here. So it is not necessay the update the state
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Add a comment to a post
  const addComment = async (id: string, comment: string) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    try {
      await axios({
        method: "POST",
        url: `${BASE_URL}/comments/`,
        data: { blogId: id, comment },
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Comment created successfully!");
      getBlog(id);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Delete a post using its id
  const deleteBlog = async (id: string, navigate: (path: string) => void) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    console.log(token);
    console.log(id);
    try {
      await axios({
        method: "DELETE",
        url: `${BASE_URL}/blogs/${id}`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Blog deleted successfully!");
      navigate("/"); // navigate to a different page if necessary
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Add a like to a post
  const addLike = async (id: string) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    try {
      await axios({
        method: "POST",
        url: `${BASE_URL}/blogs/${id}/postlike`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      getBlog(id); // Refresh the posts list
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Update a blog using its id
  const updateBlog = async (
    data: IBlogForm,
    navigate: (path: string) => void,
    id: string
  ) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    try {
      await axios({
        method: "PUT",
        url: `${BASE_URL}/blogs/${id}`,
        data: data,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Blog updated successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Get all the categories
  const getCategories = async () => {
    const url = `${BASE_URL}/categories`;
    try {
      // const { data } = await axios.get(`${BASE_URL}/categories/`);
      const { data } = await axios.get<IBlogCategoryResponse>(url);
      setCategories(data.data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // 3 - Return the provider
  // Export the values
  const value: IBlogContext = {
    blogs,
    getBlog,
    getBlogs,
    createBlog,
    deleteBlog,
    addComment,
    addLike,
    updateBlog,
    currentBlog,
    categories,
    getCategories,
    paginationData,
    setPage,
    page,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

// 4 - Create custom hook
// with this syntax it is not necessary to cover as possible undefined values, because all the values are defined
export const useBlogContext = () => useContext(BlogContext);
