import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

import AuthFailed from './AuthFailed.jsx';
import Folder from '../components/Folder.jsx';
import Modal from '../components/Modal.jsx';

function ManagePlaylists() {
	const [folders, setFolders] = useState(null);
	const [confDelModal, setConfDelModal] = useState(false);
    const [compDelModal, setCompDelModal] = useState(false);
	const [modalMsg, setModalMsg] = useState('');

	const delBtnRef = useRef();
    const delPlaylistRef = useRef();

	const { user } = useContext(UserContext);

	// get data from db when the page first renders
	// read context (session data) to get data for only this user
	useEffect(() => {
		if (user) {
			const { user_id } = user;

			const getUserData = async () => {
				const response = await fetch('/api/users/' + user_id);
				const json = await response.json();

                if (!response.ok) {
					console.log('whoops');
					console.log(json);
                }
				
                setFolders(json.folders);
			};

			getUserData();
		}
	}, []);

	// listens for clicks on the delete button in the Playlist component
	function deleteHandler(e) {
		const { target } = e;
		const btnType = target.getAttribute('data-btn-type');

		if (btnType !== 'del-btn') {
			return;
		}

		// storing the button that was clicked in the ref and its playlist so we can access it later
		delBtnRef.current = target;
        delPlaylistRef.current = target.closest('article');

		setConfDelModal(true);
		setModalMsg(
			"Are you sure you want to delete this playlist? If you want it back, you'll have to completely remake it."
		);
	}

	async function deleteConfirmedHandler() {
		// getting the id from the delete button
		const playlistID = delBtnRef.current.getAttribute('data-id');

		// make database call
        const response = await fetch('/api/playlists/' + playlistID, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (!response.ok) {
            const {message} = json;

            // swap modals and display error message
            setConfDelModal(false);
            setCompDelModal(true);
            setModalMsg(message);
        }

		// swap modals
        setConfDelModal(false);
        setCompDelModal(true);
        setModalMsg('Your playlist was successfully deleted.');

        // remove this playlist from the dom
        delPlaylistRef.current.remove();
	}

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="mb-4">
				<h2 className="page-title">Your Playlists</h2>

				<Link
					role="button"
					to="/new-playlist"
					className="rectangle-btn"
				>
					Create New +
				</Link>

				<button
					role="button"
					className="rectangle-btn mt-1 sm:mt-0 sm:ml-1 text-left"
					id="link-modal-btn"
					data-for-modal="link-modal"
				>
					Share Profile
				</button>

				{/* your folders */}
			</div>

			<section id="container" onClick={deleteHandler}>
				{folders &&
					folders.map(element => (
						<Folder key={element._id} folder={element} />
					))}
			</section>

			<Modal
                id='conf-del-modal'
                state={confDelModal}
                setState={setConfDelModal}
				modalMsg={modalMsg}
			>
				<button
					className="block font-semibold mt-0.5"
					onClick={deleteConfirmedHandler}
				>
					Yes, I want to delete it
				</button>
			</Modal>

            <Modal id='comp-del-modal' state={compDelModal} setState={setCompDelModal} modalMsg={modalMsg} navTo='/playlists' />
		</>
	);
}

export default ManagePlaylists;
