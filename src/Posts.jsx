import { useState } from "react";
import { fetchPosts, deletePost, updatePost } from "@/api";
import { PostDetail } from "@/PostDetail";
import { useQuery } from "@tanstack/react-query";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  /**
   * StaleTime vs gcTime(Garbage Collection)
   * 1. staleTime: 데이터 유효 시간(지정된 staleTime 이후에는 다시 데이터를 요청해야함 Fresh -> Stale)
   * 2. gcTime: 캐시 유효 시간
   *
   *  - Fresh 상태에서 캐시데이터가 있다면 Fetching 하지 않는다.
   *  - Stale 상태에서 캐시데이터가 있다면 Fetching 하는 동안 캐시데이터를 화면에 출력한다.
   */
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 2 * 1000, //
    // gcTime: 2000, // 캐시 유효 시간
  });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return <h3>{error.toString()}</h3>;
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
