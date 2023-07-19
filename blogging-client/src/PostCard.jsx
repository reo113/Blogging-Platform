import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import { BiDetail } from "react-icons/bi";

function PostCard({ post }) {
  // pull data from argument
  const {
    id,
    Content,
    Title,
  } = post;

  return (
    <div
      data-testid="job-card"
      className="flex gap-4 my-9 justify-between items-start"
    >
      <div className="flex items-start gap-4">
        {/* {image ? (
          <img src={image.src} alt={image.alt} />
        ) : ( */}
          <img
            src="https://placehold.co/100x100"
            alt="No company logo available"
          />
         {/* )} */}
        <div>
          <h2 className="text-xl font-bold relative -top-1.5" data-testid={id}>
            {Title}
          </h2>
          <p className="text-gray-400 italic mb-2">{Content}</p>
          <ul className="text-sm">
            <li>{Content}</li>
            {/* <li>{`$${minSalary} - $${maxSalary}`}</li> */}
            {/* <li>{postDate}</li> */}
          </ul>
        </div>
      </div>
      <Link 
        to={`/posts/${id}`}
        className="flex items-center gap-2 p-5 text-xl relative -top-6"
      >
        <BiDetail /> Details
      </Link>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    Content: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,

  }),
};

export default PostCard;
