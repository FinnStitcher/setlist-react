import PlaylistCanEdit from '../playlists/PlaylistCanEdit.jsx';

import {toggleFolder} from '../../utils/toggleBoxUtils.js';

function FolderSlim({ folder }) {
    const {name, playlists} = folder;

    return (
        <article className="fl-body">
            <div className="fl-title" onClick={toggleFolder}>
                <h3>{name}</h3>

                <p className="arrow">▲</p>
            </div>

            <div className="pl-3 py-2.5 space-y-3 block">
                {playlists[0] ? playlists.map(element => (
                    <PlaylistCanEdit key={element._id} playlist={element} />
                )) : <p>This folder is empty.</p>}
            </div>
        </article>
    )
};

export default FolderSlim;