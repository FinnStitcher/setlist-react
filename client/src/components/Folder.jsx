import Playlist from './Playlist.jsx';

function Folder({ folder }) {
    const {name, playlists} = folder;

    // toggle code here

    return (
        <section className="border border-stone-300 mb-3">
            <div className="border-b border-stone-300 px-2 py-2 flex justify-between sm:justify-start fl-title">
                <h3>{name}</h3>

                <p className="ml-2 md:ml-4">▼</p>
            </div>

            <div className="pl-3 py-2.5 space-y-3">
                {playlists && playlists.map(element => (
                    <Playlist key={element._id} playlist={element} />
                ))}
            </div>
        </section>
    )
};

export default Folder;