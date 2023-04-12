import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {useModalContext, useFetch} from '../hooks';

import FolderSlim from '../components/folders/FolderSlim.jsx';

function SingleUser() {
	const [data, setData] = useState({});
	const { setModal } = useModalContext();
	const { id: userId } = useParams();

	useEffect(() => {
		async function getData() {
			try {
                const json = await useFetch(`/api/users/${userId}`, "GET");

				setData({ ...json });
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
				<div className="page-title">
					<h2>User: {data.username}</h2>
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
