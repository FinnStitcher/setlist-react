import { Link } from "react-router-dom";

function EditButton({ url }) {
	return (
		<Link role="button" to={url} className="rectangle-btn mr-1 w-36">
			Edit
		</Link>
	);
}

export default EditButton;
