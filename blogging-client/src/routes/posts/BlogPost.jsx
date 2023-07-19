import { Link, useLoaderData } from "react-router-dom";
// import { statusTextById, statusIdByText } from "../../utils";
import PostCard from "../../PostCard";

export async function loader({ params }) {
  let url = "/api/posts";
  // if (params.status) {
  //   url += `?status=${statusIdByText[params.status]}`;
  // }
  const response = await fetch(url);
  const posts = await response.json();
  return { posts };
}

function PostList() {
  const { posts } = useLoaderData();

  // const statusLinks = Object.keys(statusTextById).map((statusId) => {
  //   const buttonClass = "px-4 py-2 border";
  //   return (
  //     <NavLink
  //       to={`/jobs/byStatus/${statusTextById[statusId]}`}
  //       key={statusId}
  //       className={({ isActive }) =>
  //         isActive ? `bg-blue-500 ${buttonClass}` : buttonClass
  //       }
  //     >
  //       {statusTextById[statusId]}
  //     </NavLink>
  //   );
  // });

  const postCards = posts.map((post) => {
    return <PostCard post={post} key={post.id} />;
  });

  return (
    <>
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 my-4">
        {statusLinks}
      </div> */}
      <div className="flex justify-between">
        <div></div>
        <div>
          <Link
            to="/jobs/new"
            className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 hover:text-white transition"
          >
            + Add Post
          </Link>
        </div>
      </div>
      {postCards}
    </>
  );
}

export default PostList;
