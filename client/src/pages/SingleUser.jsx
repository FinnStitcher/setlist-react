import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ModalContext from "../ModalContext.jsx";

import FolderSlim from '../components/FolderSlim.jsx';

function SingleUser() {
	const [data, setData] = useState({});
	const { setModal } = useContext(ModalContext);
	const { id: userId } = useParams();

	useEffect(() => {
		async function getData() {
			try {
				const response = await fetch("/api/users/" + userId);
				const json = await response.json();

				if (!response.ok) {
					const { message } = json;

					throw new Error(message);
				}

				setData({ ...json });

				console.log(data);
			} catch (err) {
				setModal({
					active: "modal",
					msg: `${err.name}: ${err.message}`
				});

				console.log(err);
			}
		}

		getData();
	}, []);

	return (
		data && (
			<>
				{" "}
				<div className="mb-4">
					<h2 className="page-title">User: {data.username}</h2>
				</div>
				<section>
					{data.folders &&
						data.folders.map((element) => (
							<FolderSlim key={element._id} folder={element} />
						))}
				</section>
			</>
		)
	);
}

export default SingleUser;
