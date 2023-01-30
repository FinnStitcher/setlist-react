import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Playlist from '../components/Playlist.jsx';

function Playlists() {
    const [playlists, setPlaylists] = useState(null);

    // get data from db when the page first renders
    // temporarily just getting a list of all playlists in the db
    // should be all playlists belonging to the current user - will need to figure out how to read the session
    useEffect(() => {
        const getPlaylistData = async () => {
            const response = await fetch('/api/playlists');
            const json = await response.json();

            if (response.ok) {
                setPlaylists(json);
            }
        };

        getPlaylistData();
    }, []);

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

export default Playlists;