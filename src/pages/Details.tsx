import { useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { useBlogContext } from "../context/BlogContext";
import Card from "../components/Card";

export default function Details() {
  // useParams: The useParams hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the <Route path>. Child routes inherit all params from their parent routes.
  const { id } = useParams();

  const { getBlog, currentBlog } = useBlogContext();

  // Whenever the id is changed, but it will just change when the page is loaded
  useEffect(() => {
    // If it is not undefined, the blog will be got from that page
    if (id) getBlog(id);
  }, [id]);

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto">
        {currentBlog && <Card blog={currentBlog} preview={false} />}
      </div>
    </Layout>
  );
}
