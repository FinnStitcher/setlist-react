import PlaylistCanEdit from '../playlists/PlaylistCanEdit.jsx';

function FolderSlim({ folder }) {
    const {name, playlists} = folder;

	function toggleFolder(e) {
		const { target } = e;
        const titleBlock = target.closest(".fl-title");

		// get the ul associated with this title div
		const folderBody = titleBlock.nextElementSibling;
		// get the arrow
		const arrow = titleBlock.querySelector('.fl-arrow');

		if (folderBody.matches('.hidden')) {
			folderBody.className = 'pl-3 py-2.5 space-y-3 block';

            titleBlock.className = titleBlock.className.replace(" no-border", "");

            arrow.style.transform = "rotate(0deg) translateY(0px)";
		} else if (folderBody.matches('.block')) {
			folderBody.className = 'hidden';

            titleBlock.className += " no-border";

            arrow.style.transform = "rotate(180deg) translateY(-3px)";
		}
	}

    return (
        <section className="border border-stone-300 mb-3">
            <div className="fl-title" onClick={toggleFolder}>
                <h3>{name}</h3>

                <p className="fl-arrow">▲</p>
            </div>

            <div className="pl-3 py-2.5 space-y-3 block">
                {playlists[0] ? playlists.map(element => (
                    <PlaylistCanEdit key={element._id} playlist={element} />
                )) : <p>This folder is empty.</p>}
            </div>
        </section>
    )
};

export default FolderSlim;