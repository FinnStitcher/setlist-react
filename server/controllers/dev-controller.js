const { Playlist, User, Folder } = require("../models");
require("dotenv").config();

// these functions ignore ownership, but you need to provide a valid access key in the headers

function checkDevAuth(key) {
	// key parameter is the value of req.query.key
	if (key === process.env.API_KEY) {
		return true;
	} else {
		return false;
	}
}

const devController = {
	// make any edit to a user
	async devEditUser(req, res) {
		const isDev = checkDevAuth(req.query.key);

		if (!isDev) {
			res.status(403).json({ message: "You are not authorized to use this endpoint." });
			return;
		}

		const userId = req.params.id;
		const { body } = req;

		// attempt to edit
		try {
			const userDbRes = await Playlist.findOneAndUpdate(
				{ _id: userId },
				{ ...body },
				{ new: true }
			);

			if (!userDbRes) {
				res.status(404).json({ message: "No user with that ID." });
				return;
			}

			res.status(200).json(userDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	// make any edit to a playlist
	async devEditPlaylist(req, res) {
		const isDev = checkDevAuth(req.query.key);

		if (!isDev) {
			res.status(403).json({ message: "You are not authorized to use this endpoint." });
			return;
		}

		const playlistId = req.params.id;
		const { body } = req;

		// attempt to edit
		try {
			const playlistDbRes = await Playlist.findOneAndUpdate(
				{ _id: playlistId },
				{ ...body },
				{ new: true }
			);

			if (!playlistDbRes) {
				res.status(404).json({ message: "No playlist with that ID." });
				return;
			}

			res.status(200).json(playlistDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async devDeleteUser(req, res) {
		const isDev = checkDevAuth(req.query.key);

		if (!isDev) {
			res.status(403).json({ message: "You are not authorized to use this endpoint." });
			return;
		}

		const userId = req.params.id;

		// delete user
		try {
			const userDbRes = await User.findOneAndDelete({ _id: userId });

			if (!userDbRes) {
				res.status(404).json({ message: "No user with that ID." });
				return;
			}

			const { playlists, folders } = userDbRes;

			const playlistDbRes = await Playlist.deleteMany({
				_id: {
					$in: [...playlists]
				}
			});

			if (!playlistDbRes) {
				res.status(404).json({
					message:
						"User was deleted successfully, but there was an error deleting their playlists."
				});
				return;
			}

			const folderDbRes = await Folder.deleteMany({
				_id: {
					$in: [...folders]
				}
			});

			if (!folderDbRes) {
				res.status(404).json({
					message:
						"User was deleted successfully, but there was an error deleting their folders."
				});
				return;
			}

			res.status(200).json({
				userDbRes,
				folderDbRes,
				playlistDbRes
			});
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async devDeletePlaylist(req, res) {
		const isDev = checkDevAuth(req.query.key);

		if (!isDev) {
			res.status(403).json({ message: "You are not authorized to use this endpoint." });
			return;
		}

		const playlistId = req.params.id;

		// attempt to delete
		try {
			// delete playlist
			const playlistDbRes = await Playlist.findOneAndDelete({
				_id: playlistId
			});

			if (!playlistDbRes) {
				res.status(404).json({ message: "No playlist with that ID." });
				return;
			}

			const { uploadedBy: userId } = playlistDbRes;

			// remove playlist from relevant user's profile
			const userDbRes = await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { playlists: playlistId } },
				{ new: true }
			).populate("playlists");

			res.status(200).json(userDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}
};

module.exports = devController;
