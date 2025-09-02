import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "@/api";
import { PostDetail } from "@/PostDetail";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      /**
       * 기본적으로 stale 상태로 설정되어 있으며, 데이터가 stale 상태일 때 캐시데이터를 화면에 출력한다.
       * 때문에 현재 페이지에서 다음 페이지로 넘어갈때 사용자는 캐시된 데이터를 보기 때문에 로딩화면을 보지 않아도 된다. (사용자 경험 향상)
       */
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient]);

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  /**
   * StaleTime vs gcTime(Garbage Collection)
   * 1. staleTime: 데이터 유효 시간(지정된 staleTime 이후에는 다시 데이터를 요청해야함 Fresh -> Stale)
   * 2. gcTime: 캐시 유효 시간
   *
   *  - Fresh 상태에서 캐시데이터가 있다면 Fetching 하지 않는다.
   *  - Stale 상태에서 캐시데이터가 있다면 Fetching 하는 동안 캐시데이터를 화면에 출력한다.
   */
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2 * 1000, //
    // gcTime: 2000, // 캐시 유효 시간
  });

  /**
   * isLoading
   * - 실제로 캐시된 데이터가 없고 데이터를 가져오고 있는 상태
   */
  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return <h3>{error.toString()}</h3>;
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const selectPost = (post) => {
    setSelectedPost(post);
    deleteMutation.reset();
    updateMutation.reset();
  };

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => selectPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={goToPrevPage}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={goToNextPage}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      )}
    </>
  );
}
