import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {useUserContext, useModalContext} from '../../hooks';

import AuthFailed from "../error_pages/AuthFailed";
import FolderSlim from "../../components/folders/FolderSlim";
import MngLinkBtn from '../../components/generic/MngLinkBtn';
import PageTitle from '../../components/layout/PageTitle';
import Modal from "../../components/layout/Modal";

function ManagePlaylists() {
	const [folders, setFolders] = useState(null);

	const { user } = useUserContext();
	const { modal, setModal } = useModalContext();

	const delBtnRef = useRef();
	const delPlaylistRef = useRef();

	// get data from db when the page first renders
	// read context (session data) to get data for only this user
	useEffect(() => {
		if (user) {
			const { user_id } = user;

			async function getUserData() {
				try {
					const response = await fetch("/api/users/" + user_id);
					const json = await response.json();

					if (!response.ok) {
						const { message } = json;

						throw Error(message);
					}

					setFolders(json.folders);
				} catch (err) {
					setModal({
						...modal,
						active: "modal",
						msg: `${err.name}: ${err.message}`
					});

					console.log(err);
				}
			}

			getUserData();
		}
	}, []);

	function getLinkHandler() {
		setModal({
			...modal,
			active: "link-modal",
			msg: "To share your profile with others, copy this link."
		});
	}

	// listens for clicks on the delete button in the playlist component
	function deleteHandler(e) {
		const { target } = e;
		const btnType = target.getAttribute("data-btn-type");

		if (btnType !== "del-btn") {
			return;
		}

		// storing the button that was clicked in the ref and its playlist so we can access it later
		delBtnRef.current = target;
		delPlaylistRef.current = target.closest("article");

		setModal({
			...modal,
			active: "conf-del-modal",
			msg: "Are you sure you want to delete this playlist? If you want it back, you'll have to completely remake it."
		});
	}

	async function deleteConfirmedHandler() {
		// getting the id from the delete button
		const playlistID = delBtnRef.current.getAttribute("data-id");

		// make database call
		try {
			const response = await fetch("/api/playlists/" + playlistID, {
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				}
			});
			const json = await response.json();

			if (!response.ok) {
				const { message } = json;

				throw Error(message);
			}

			// swap modals
			setModal({
				...modal,
				active: "comp-del-modal",
				msg: "Your playlist was successfully deleted."
			});

			// remove this playlist from the dom
			delPlaylistRef.current.remove();
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
				<h2>Your Playlists</h2>

                <MngLinkBtn url="/new-playlist" text="Create New +" />

                <MngLinkBtn url="/folders" text="Your Folders" />

				<button
					role="button"
					className="rectangle-btn sm:mt-0 text-left"
					onClick={getLinkHandler}
				>
					Share Profile
				</button>
			</div>

			<section id="container" onClick={deleteHandler}>
				{folders &&
					folders.map((element) => (
						<FolderSlim key={element._id} folder={element} />
					))}
			</section>

			<Modal id="conf-del-modal">
				<button
					className="block font-semibold mt-0.5"
					onClick={deleteConfirmedHandler}
				>
					Yes, I want to delete it
				</button>
			</Modal>

			<Modal id="comp-del-modal" />

			<Modal id="link-modal">
				<p className="mx-3 my-2 bg-stone-300 text-stone-800 rounded-md p-1">
					<Link
						to={`${window.location.origin}/users/${user.user_id}`}
					>
						{window.location.origin}/users/{user.user_id}
					</Link>
				</p>
			</Modal>
		</>
	);
}

export default ManagePlaylists;
