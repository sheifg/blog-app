import { useState } from "react";
import { BiSolidComment, BiSolidLike } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useBlogContext } from "../context/BlogContext";

interface CardProps {
  // It can single blog or blog
  // userId categoryId are objects getting a single blog in postman
  // When all the blogs are got, both are strings, so it is necessary to create two different type of blog interface
  blog: ISingleBlog | IBlog;
  preview?: boolean;
}

// Preview mode:
// - if preview is true, it is rendering all the cards
// - if preview is false, it is a single card
export default function Card({ blog, preview }: CardProps) {
  // To make the controlled input
  const [enteredComment, setEnteredComment] = useState("");
  const navigate = useNavigate();
  const { deleteBlog, addComment, addLike } = useBlogContext();
  // Collect the current user
  const { userInfo } = useAuth();

  const isOwner = (blog as ISingleBlog)?.userId?._id === userInfo?._id;
  // likes is an arry inside a single blog in postamn, so it is necessary to check if it includes the id
  const isLiked = (blog as ISingleBlog)?.likes?.includes(
    userInfo?._id as string
  );

  // console.log(blog);
  // console.log(userInfo);
  //console.log('isOwner', isOwner, 'isLiked', isLiked);

  const handleDelete = (id: string) => {
    deleteBlog(id, navigate);
  };

  const handleLike = (id: string) => {
    addLike(id);
  };

  const handleComment = (id: string) => {
    // .trim is a string method, that removes empty spaces at the begining and at the end of the string
    if (enteredComment.trim().length == 0)
      return toast.error("Please add the comment");
    addComment(id, enteredComment);
    // To reset the comment field
    setEnteredComment("");
  };

  console.log("Image:", blog.image);

  return (
    <div className="border border-gray-200 shadow rounded-lg">
      {/* //* image */}
      <Link to={`/blog/details/${blog?._id}`}>
        <img src={blog?.image} className="h-[200px] object-cover w-full" />
      </Link>
      {/* //* card content */}
      <div className="flex flex-col p-5">
        {/* //* card title */}
        <Link to={`/blog/details/${blog?._id}`}>
          <h5 className="mb-2 text-2xl font-bold text-center">{blog?.title}</h5>
        </Link>
        {/* //* card details */}
        <div>
          <div className="flex justify-between">
            <p className="font-bold">Published on:</p>
            <p className="italic">{new Date(blog?.createdAt).toDateString()}</p>
          </div>
          {/* if there are a blog user id and a username */}
          {(blog as ISingleBlog)?.userId?.username && (
            <div className="flex justify-between">
              <p className="font-bold">Author:</p>
              {/* <p className="italic">{blog.userId.username}</p> */}
              <p className="italic">{(blog as ISingleBlog).userId.username}</p>
            </div>
          )}
        </div>
        <hr />

        {/* //* blog content */}
        <div
          className={
            preview
              ? "line-clamp-1 truncate whitespace-pre-wrap my-3 flex-1"
              : ""
          }
          // The html will be the blog content
          // The inner html syntax is updating
          // If There is an html content, it is necessary to tell that is html content and it should be used

          // dangerouslySetInnerHTML: is React’s replacement for using innerHTML. dangerouslySetInnerHTML is a property that you can use on HTML elements in a React application to programmatically set their content. Instead of using a selector to grab the HTML element and then setting its innerHTML, you can use this property directly on the element.
          dangerouslySetInnerHTML={{ __html: blog?.content }}
        >
          {/* if you use this the user will see the <p></p> context. But we just want to updated the inner html, so we need to write the above command */}
          {/* {blog?.content} */}
          {/*example that the user will see in the card: <p>hjhjhdjshd</p> */}
          {/* our blog.content contains html tags in it. such as <p></p>. And I dont want to render them. In that case I need to update the inner html of this div */}
        </div>

        <hr />

        <div
          className={`flex space-x-10 pr-3 mt-5 ${
            preview ? "justify-center" : "justify-between"
          }`}
        >
          {/* //* Delete and Edit Buttons*/}
          {!preview && isOwner && (
            <div className="flex space-x-5 my-5">
              <button
                className="btn-danger"
                onClick={() => handleDelete(blog?._id)}
              >
                DELETE
              </button>
              <button
                className="btn-warning"
                // using useLocation
                onClick={
                  () =>
                    // first parameter the location where the browser should go
                    // second parameter is the info inside the state
                    navigate(`/blog/edit/${blog?._id}`, { state: blog })
                  // alternatively you can have a state in your context to track whether you are editing or not
                  // setIsEditMode(!isEditMode)
                }
              >
                EDIT
              </button>
            </div>
          )}

          {/* //* Like, Comment, View Icons*/}
          <div className="flex space-x-5 my-5">
            <div className="relative">
              <BiSolidLike
                className={`text-2xl ${
                  isLiked ? "text-blue-800" : "text-blue-500"
                } relative cursor-pointer`}
                onClick={() => {
                  handleLike(blog?._id);
                }}
              />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.likes.length}
              </div>
            </div>
            <div className="relative">
              <BiSolidComment className="text-2xl text-green-500 relative cursor-pointer" />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.comments.length}
              </div>
            </div>
            <div className="relative">
              <BsFillEyeFill className="text-2xl text-gray-500 relative cursor-pointer" />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.countOfVisitors}
              </div>
            </div>
          </div>
        </div>

        <hr />
        {/* //* Comments Section */}
        {!preview && blog?.comments.length !== 0 && (
          <>
            {/* for every comment i want to create a div */}
            {/* It contains the comment information, as ISingleBlog comment will be an array of objects(as Postamn shows for a single blog). But if you check when you get all the blogs, comments is an array of string. Fot that reason we need to identify blog as ISingleBlog, because we are working with the coments just a single blog  */}
            {(blog as ISingleBlog)?.comments.map((comment, index) => (
              <div
                key={index}
                className="flex justify-between items-center my-10"
              >
                <div className="flex space-x-5">
                  <p>{comment?.userId?.username}</p>
                  <p className="font-italic"> {comment?.comment}</p>
                </div>
                <p>
                  {comment?.createdAt &&
                    new Date(comment?.createdAt).toDateString()}
                </p>
              </div>
            ))}
          </>
        )}

        {!preview && blog?.comments?.length == 0 && (
          <p className="text-center"> No comments add one</p>
        )}

        {/* //* Add Comment Section */}

        {!preview && (
          <div className="flex space-x-2 mt-10">
            <input
              type="text"
              className="form-control"
              // controlled input
              value={enteredComment}
              onChange={(e) => setEnteredComment(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() => handleComment(blog?._id)}
            >
              {" "}
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
