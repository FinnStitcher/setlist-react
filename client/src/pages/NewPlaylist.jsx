import { useState, useContext } from 'react';
import UserContext from '../UserContext.jsx';

import AuthFailed from './AuthFailed.jsx';
import PlaylistForm from '../components/PlaylistForm.jsx';

function NewPlaylist() {
	const [plData, setPlData] = useState(null);
	const { user } = useContext(UserContext);

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="mb-4">
                <h2 className="page-title">Create Playlist</h2>
            </div>

            <PlaylistForm />
		</>
	);
}

export default NewPlaylist;
