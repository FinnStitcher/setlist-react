import { useState, useEffect, useRef } from "react";

import { useUserContext, useModalContext, useFetch } from "../../hooks";

import AuthFailed from "../error_pages/AuthFailed.jsx";
import FolderCanEdit from "../../components/folders/FolderCanEdit.jsx";
import MngLinkBtn from "../../components/generic/MngLinkBtn";
import Modal from "../../components/layout/Modal.jsx";

function ManageFolders() {
	const [folders, setFolders] = useState(null);

	const { user } = useUserContext();
	const { modal, setModal } = useModalContext();

	const delBtnRef = useRef();
	const delFolderRef = useRef();

	useEffect(() => {
		if (user) {
			const { user_id } = user;

			const getUserData = async () => {
				try {
					const json = await useFetch(`/api/users/${user_id}`, "GET");

					setFolders(json.folders);
				} catch (err) {
					setModal({
						...modal,
						active: "modal",
						msg: `${err.name}: ${err.message}`
					});

					console.log(err);
				}
			};

			getUserData();
		}
	}, []);

	// listens for clicks on the delete button in the folder component
	function deleteHandler(e) {
		const { target } = e;
		const btnType = target.getAttribute("data-btn-type");

		if (btnType !== "del-btn") {
			return;
		}

		// storing the button that was clicked in the ref and its playlist so we can access it later
		delBtnRef.current = target;
		delFolderRef.current = target.closest("article");

		setModal({
			...modal,
			active: "conf-del-modal",
			msg: "Are you sure you want to delete this folder? If you want it back, you'll have to completely remake it."
		});
	}

	async function deleteConfirmedHandler() {
		// getting the id from the delete button
		const folderId = delBtnRef.current.getAttribute("data-id");

		// make database call
		try {
			await useFetch(`/api/folders/${folderId}`, "DELETE", null, user.token);

			// swap modals
			setModal({
				...modal,
				active: "comp-del-modal",
				msg: "This folder was successfully deleted."
			});

			// move this folder's contents to Unsorted
			const delFolderList = delFolderRef.current.childNodes[1].childNodes[1];
			const unsortedFolderList = document.querySelector("#unsorted");

			delFolderList.childNodes.forEach((element) => {
				unsortedFolderList.append(element);
			});

			// remove this playlist from the dom
			delFolderRef.current.remove();
		} catch (err) {
			setModal({
				...modal,
				active: "modal",
				msg: `${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="page-title">
				<h2>Your Folders</h2>

				<MngLinkBtn url="/new-folder" text="Create New +" />

				<MngLinkBtn url="/playlists" text="Your Playlists" />
			</div>

			<section id="container" onClick={deleteHandler}>
				{folders &&
					folders.map((element) => <FolderCanEdit key={element._id} folder={element} />)}
			</section>

			<Modal id="conf-del-modal">
				<button className="block font-semibold mt-0.5" onClick={deleteConfirmedHandler}>
					Yes, I want to delete it
				</button>
			</Modal>

			<Modal id="comp-del-modal" />
		</>
	);
}

export default ManageFolders;
