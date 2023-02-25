import {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import UserContext from '../UserContext.jsx';

import AuthFailed from './AuthFailed.jsx';
import PlaylistForm from '../components/PlaylistForm.jsx';

function EditPlaylist() {
    const [plData, setPlData] = useState(null);
    const {user} = useContext(UserContext);
    const {id: playlistId} = useParams();

    // check user ownership

    // get data
    useEffect(() => {
        const getPlaylistData = async () => {
            const response = await fetch('/api/playlists/' + playlistId);
            const json = await response.json();

            if (response.ok) {
                setPlData({
                    title: json.title,
                    songs: [...json.songs]
                });
            } else {
                console.log('whoops');
                console.log(json);
            }
        };

        getPlaylistData();
    }, []);

    if (!user) {
        return <AuthFailed />
    }

    return (<>
        <div className="mb-4">
            <h2 className="page-title">Update Playlist</h2>
        </div>

        <PlaylistForm plData={plData} />
    </>)
};

export default EditPlaylist;