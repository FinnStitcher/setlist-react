import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../UserContext.jsx';
import ModalContext from '../../ModalContext.jsx';

import AuthFailed from '../error_pages/AuthFailed.jsx';
import Forbidden from '../error_pages/Forbidden.jsx';
import PlaylistForm from '../../components/playlists/PlaylistForm.jsx';

function EditPlaylist() {
	const [plData, setPlData] = useState(null);
	const { user } = useContext(UserContext);
	const { setModal } = useContext(ModalContext);
	const { id: playlistId } = useParams();

	// get data
	useEffect(() => {
		async function getPlaylistData() {
            try {
                const response = await fetch('/api/playlists/' + playlistId);
                const json = await response.json();

                if (!response.ok) {
                    const { message } = json;

                    throw Error(message);
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
            } catch (err) {
                setModal({
                    active: 'modal',
                    msg: `${err.name}: ${err.message}`
                });

                console.log(err);
            }
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
		</>
	);
}

export default EditPlaylist;
