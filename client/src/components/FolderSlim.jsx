import PlaylistCanEdit from './PlaylistCanEdit.jsx';

function Folder({ folder }) {
    const {name, playlists} = folder;

	function toggleFolder(e) {
		const { target } = e;

		// get the ul associated with this title div
		const folderBody = target.closest('.fl-title').nextElementSibling;
		// get the arrow
		const arrow = target.closest('.fl-title').querySelector('.fl-arrow');

		if (folderBody.matches('.hidden')) {
			folderBody.className = 'pl-3 py-2.5 space-y-3 block';

			arrow.textContent = '▲';
		} else if (folderBody.matches('.block')) {
			folderBody.className = 'hidden';

			arrow.textContent = '▼';
		}

		// TODO: animate it to rotate rather than just swapping
	}

    return (
        <section className="border border-stone-300 mb-3">
            <div className="border-b border-stone-300 px-2 py-2 flex justify-between sm:justify-start fl-title" onClick={toggleFolder}>
                <h3>{name}</h3>

                <p className="ml-2 md:ml-4 fl-arrow">▲</p>
            </div>

            <div className="pl-3 py-2.5 space-y-3 block">
                {playlists && playlists.map(element => (
                    <PlaylistCanEdit key={element._id} playlist={element} />
                ))}
            </div>
        </section>
    )
};

export default Folder;