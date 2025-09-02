import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@/api";
import "@/PostDetail.css";

export function PostDetail({ post }) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 2 * 1000,
  });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
