import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {useUserContext, useModalContext, useFetch} from '../../hooks';

import AuthFailed from '../error_pages/AuthFailed.jsx';
import Forbidden from '../error_pages/Forbidden.jsx';
import PlaylistFormWrapper from '../../components/playlists/PlaylistFormWrapper.jsx';

function EditPlaylist() {
	const [plData, setPlData] = useState(null);
	const { user } = useUserContext();
	const { setModal } = useModalContext();
	const { id: playlistId } = useParams();

	// get data
	useEffect(() => {
		async function getPlaylistData() {
            try {
                const json = await useFetch(`/api/playlists/${playlistId}`, "GET");
                // check user ownership
                if (user.user_id !== json.uploadedBy) {
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
			<div className="page-title">
				<h2>Update Playlist</h2>
			</div>

			{plData && <PlaylistFormWrapper plData={plData} />}
		</>
	);
}

export default EditPlaylist;
