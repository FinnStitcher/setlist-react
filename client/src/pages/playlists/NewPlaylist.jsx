import { useContext } from 'react';
import UserContext from '../../UserContext.jsx';

import AuthFailed from '../error_pages/AuthFailed.jsx';
import PlaylistForm from '../../components/playlists/PlaylistForm.jsx';

function NewPlaylist() {
	const { user } = useContext(UserContext);

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="page-title">
                <h2>Create Playlist</h2>
            </div>

            <PlaylistForm />
		</>
	);
}

export default NewPlaylist;
