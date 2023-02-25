import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

import AuthFailed from './AuthFailed.jsx';
import Playlist from '../components/Playlist.jsx';

function ManagePlaylists() {
    const [playlists, setPlaylists] = useState(null);

    const {user} = useContext(UserContext);

    // get data from db when the page first renders
    // read context (session data) to get data for only this user
    useEffect(() => {
        if (user) {
            const {user_id} = user;

            const getPlaylistData = async () => {
                const response = await fetch('/api/users/' + user_id);
                const json = await response.json();

                if (response.ok) {
                    setPlaylists(json.playlists);
                } else {
                    console.log('whoops');
                    console.log(json);
                }
            };

            getPlaylistData();            
        }
    }, []);

    if (!user) {
        return <AuthFailed />
    }

    return (
        <>
        <div className="mb-4">
            <h2 className="page-title">Your Playlists</h2>

            <Link role="button" to="/add-playlist" className="rectangle-btn">Create New +</Link>

            <button role="button" className="rectangle-btn mt-1 sm:mt-0 sm:ml-1 text-left" id="link-modal-btn" data-for-modal="link-modal">Share Profile</button>
        </div>

        <section id="playlist-container">
            {playlists && playlists.map(element => (
                <Playlist key={element._id} playlist={element} />
            ))}
        </section>
        </>
    )
};

export default ManagePlaylists;