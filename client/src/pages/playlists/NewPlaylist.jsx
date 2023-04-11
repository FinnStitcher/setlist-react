import {useUserContext} from '../hooks';

import AuthFailed from '../error_pages/AuthFailed.jsx';
import PlaylistFormWrapper from '../../components/playlists/PlaylistFormWrapper.jsx';

function NewPlaylist() {
	const { user } = useUserContext();

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="page-title">
                <h2>Create Playlist</h2>
            </div>

			<PlaylistFormWrapper />
		</>
	);
}

export default NewPlaylist;
