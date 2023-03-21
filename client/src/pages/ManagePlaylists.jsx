import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

import AuthFailed from './AuthFailed.jsx';
import Folder from '../components/Folder.jsx';
import Modal from '../components/Modal.jsx';

function ManagePlaylists() {
    const [folders, setFolders] = useState(null);
    const {user} = useContext(UserContext);

    // get data from db when the page first renders
    // read context (session data) to get data for only this user
    useEffect(() => {
        if (user) {
            const {user_id} = user;

            const getUserData = async () => {
                const response = await fetch('/api/users/' + user_id);
                const json = await response.json();

                if (response.ok) {
                    setFolders(json.folders);
                } else {
                    console.log('whoops');
                    console.log(json);
                }
            };

            getUserData();            
        }
    }, []);

    if (!user) {
        return <AuthFailed />
    }

    return (
        <>
        <div className="mb-4">
            <h2 className="page-title">Your Playlists</h2>

            <Link role="button" to="/new-playlist" className="rectangle-btn">Create New +</Link>

            <button role="button" className="rectangle-btn mt-1 sm:mt-0 sm:ml-1 text-left" id="link-modal-btn" data-for-modal="link-modal">Share Profile</button>

            {/* your folders */}
        </div>

        <section id="container">
            {folders && folders.map(element => (
                <Folder key={element._id} folder={element} />
            ))}
        </section>
        </>
    )
};

export default ManagePlaylists;