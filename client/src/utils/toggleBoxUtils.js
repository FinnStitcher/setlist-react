export function togglePlaylist(e) {
	const { target } = e;
	const titleBlock = target.closest(".pl-title");

	// get the ul associated with this title div
	const playlistBody = titleBlock.nextElementSibling;
	// get the arrow
	const arrow = titleBlock.querySelector(".arrow");

	if (playlistBody.matches(".hidden")) {
		playlistBody.className = "block";
	} else if (playlistBody.matches(".block")) {
		playlistBody.className = "hidden";
	}

	if (arrow.className.includes("arrow-rotate")) {
		arrow.className = arrow.className.replace(" arrow-rotate", "");
	} else {
		arrow.className += " arrow-rotate";
	}
}

export function toggleFolder(e) {
	const { target } = e;
	const titleBlock = target.closest(".fl-title");

	// get the ul associated with this title div
	const folderBody = titleBlock.nextElementSibling;
	// get the arrow
	const arrow = titleBlock.querySelector(".arrow");

	if (folderBody.matches(".hidden")) {
		folderBody.className = "pl-3 py-2.5 space-y-3 block";

		titleBlock.className = titleBlock.className.replace(" no-border", "");
	} else if (folderBody.matches(".block")) {
		folderBody.className = "hidden";

		titleBlock.className += " no-border";
	}

	if (arrow.className.includes("arrow-rotate")) {
		arrow.className = arrow.className.replace(" arrow-rotate", "");
	} else {
		arrow.className += " arrow-rotate";
	}
}
