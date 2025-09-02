import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@/api";
import "@/PostDetail.css";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  const {
    mutate: deletePost,
    isPending: isDeleting,
    isError: isDeletingError,
    error: deletingError,
    isSuccess: isDeletingSuccess,
  } = deleteMutation;

  const {
    mutate: updatePost,
    isPending: isUpdating,
    isError: isUpdatingError,
    error: updatingError,
    isSuccess: isUpdatingSuccess,
  } = updateMutation;

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
      <div>
        <button onClick={() => deletePost(post.id)}>Delete</button>
        {isDeleting && <p className="loading">Deleting the post</p>}
        {isDeletingError && (
          <p className="error">
            Error deleting the post: {deletingError.toString()}
          </p>
        )}
        {isDeletingSuccess && <p className="success">Post was deleted</p>}
      </div>
      <div>
        <button onClick={() => updatePost(post.id)}>Update title</button>
        {isUpdating && <p className="loading">Updating the post</p>}
        {isUpdatingError && (
          <p className="error">
            Error updating the post: {updatingError.toString()}
          </p>
        )}
        {isUpdatingSuccess && <p className="success">Post was updated</p>}
      </div>
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
