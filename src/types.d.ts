//! Auth Type Definitions

// Using an interface, it can de added I and then the name: IUser
interface IUser {
  // That info comes from postman, from the response of login a user
  // https://39222.fullstack.clarusway.com/auth/login
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  _id?: string;
  password?: string;
}

interface ICurrentUser extends IUser {
  token: string;
}

//! Blog Type Definitions
interface IBlog {
  _id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  image: string;
  isPublish: boolean;
  comments: string[];
  likes: string[];
  countOfVisitors: number;
  createdAt: string;
  updatedAt: string;
}

interface IBlogForm {
  categoryId: string;
  title: string;
  content: string;
  image: string;
}

// Omit is used to omit certain properties from an object
// we dont use because it will be more lines than creating a new interface
// type IBlogForm = Omit<
//   IBlog,
//   '_id',
//   'comments',
//   'isPublish',
//   'likes',
//   'countOfVisitors',
//   'createdAt',
//   'updatedAt',
//   'userId'
// >;

// Postman, related to pagination
// https://39222.fullstack.clarusway.com/blogs?limit=10 limited to 10 pages to show me
// https://39222.fullstack.clarusway.com/blogs?limit=10&page=1 just show me the page 1
// https://39222.fullstack.clarusway.com/blogs?limit=10&page=2 just show me the page 2

// Getting it in postman for all blogs
interface IBlogs {
  error: string;
  data: IBlog[];
  details: {
    totalRecords: number;
    pages: {
      next: number | boolean;
      previous: number | boolean;
    };
  };
}

// Getting it in postmn for a single blog, the followings:
interface IBlogUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface IBlogCategory {
  _id: string;
  name: string;
}

// Response type from api
interface IBlogCategoryResponse {
  data: IBlogCategory[];
}

interface IBlogComment {
  _id: string;
  blogId: string;
  userId: IBlogUser;
  comment: string;
  createdAt: string;
}

interface ISingleBlog {
  _id: string;
  userId: IBlogUser;
  categoryId: IBlogCategory;
  title: string;
  content: string;
  image: string;
  isPublish: boolean;
  comments: IBlogComment[];
  likes: string[];
  countOfVisitors: number;
  createdAt: string;
  updatedAt: string;
}

interface ISingleBlogResponse {
  data: ISingleBlog;
}

interface IPaginationData {
  count: number;
  next: number | boolean;
  previous: number | boolean;
  totalPages: number;
}
