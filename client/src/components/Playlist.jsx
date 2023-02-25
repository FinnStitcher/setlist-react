import { Link } from 'react-router-dom';

import Song from './Song.jsx';

function Playlist({ playlist }) {
    const {_id, title, songs} = playlist;

    function togglePlaylist(e) {
        const {target} = e;

        // get the ul associated with this title div
        const playlistBody = target.closest('.pl-title').nextElementSibling;
        // get the arrow
        const arrow = target.closest('.pl-title').querySelector('.pl-arrow');

        if (playlistBody.matches('.hidden')) {
            playlistBody.className = 'block';

            arrow.textContent = '▲';
        } else if (playlistBody.matches('.block')) {
            playlistBody.className = 'hidden';

            arrow.textContent = '▼';
        }
    };

    return (
        <article className="border-2 border-stone-300 mb-3">
            <div className="pl-title" onClick={togglePlaylist}>
                <h3>{title}</h3>
                <p className="ml-2 md:ml-4 pl-arrow">▼</p>
            </div>
            
            <div className="hidden">
                <div className="border-t-2 border-stone-400">
                    <Link role="button" to={`/edit-playlist/${_id}`} className="rectangle-btn mr-1 w-36">Edit</Link>

                    <button type="button" data-id={_id} data-modal-btn="open-modal" data-btn-type="del-btn" className="rectangle-btn w-36 text-left">Delete</button>
                </div>

                <div className="pl-3 py-2.5">
                    <ul className="divide-y space-y-1.5">
                        {songs && songs.map(element => (
                            <Song key={element._id} song={element} />
                        ))}
                    </ul>

                    <hr />

                    <p className="-mt-2">
                        <Link to={`/playlists/${_id}`}>Link to this playlist.</Link>
                    </p>
                </div>
            </div>
        </article>
    )
};

export default Playlist;