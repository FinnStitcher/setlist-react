import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

import AuthFailed from './AuthFailed.jsx';
import Forbidden from './Forbidden.jsx';
import PlaylistForm from '../components/PlaylistForm.jsx';
import Modal from '../components/Modal.jsx';

function EditPlaylist() {
	const [plData, setPlData] = useState(null);
	const [modal, setModal] = useState(false);
	const [modalMsg, setModalMsg] = useState('');

	const { user } = useContext(UserContext);

	const { id: playlistId } = useParams();
	const navigate = useNavigate();

	// get data
	useEffect(() => {
		async function getPlaylistData() {
			const response = await fetch('/api/playlists/' + playlistId);
			const json = await response.json();

			if (!response.ok) {
				const { message } = json;
				setModalMsg('Error: ' + message);

				setTimeout(() => {
					navigate('/playlists');
				}, 2000);

				return;
			}

			// check user ownership
			if (user.username !== json.username) {
				const forbidden = "edit someone else's playlist";
				return <Forbidden forbidden={forbidden} />;
			}

			setPlData({
				title: json.title,
				selected: [...json.songs]
			});
		}

		getPlaylistData();
	}, []);

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="mb-4">
				<h2 className="page-title">Update Playlist</h2>
			</div>

			<PlaylistForm plData={plData} />

			<Modal
				id="modal"
				state={modal}
				setState={setModal}
				modalMsg={modalMsg}
			/>
		</>
	);
}

export default EditPlaylist;
