import { Link } from "react-router-dom";

// "management link button"
function MngLinkBtn({ url, text }) {
	return (
		<Link to={url} className="rectangle-btn">
			{text}
		</Link>
	);
}

export default MngLinkBtn;