const { Folder, User } = require("../models");
const { checkFolderOwnership } = require("../utils/utils.js");
const { checkToken } = require("../utils/auth.js");

const folderController = {
	async getAllFolders(req, res) {
		try {
			const folderDbRes = await Folder.find({});

			res.status(200).json(folderDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getOneFolder(req, res) {
		const searchTerm = req.params.id;

		try {
			const folderDbRes = await Folder.findOne({
				_id: searchTerm
			}).populate({
				path: "playlists",
				select: "-__v"
			});

			if (!folderDbRes) {
				res.status(404).json({ message: "No folder with that ID." });
				return;
			}

			res.status(200).json(folderDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async postFolder(req, res) {
		const { name, playlists } = req.body;
		const { _id: userId, username } = checkToken(req, res);

		// confirm user is logged in
		if (!userId) {
			res.status(401).json({
				message: "You need to be logged in to do that."
			});
			return;
		}

		try {
			const folderDbRes = await Folder.create({
				name,
				playlists,
				uploadedBy: userId,
				uploaderUsername: username
			});

			const { _id } = folderDbRes;

			// update relevant user profile
			await User.findOneAndUpdate(
				{ _id: userId },
				{ $push: { folders: _id } },
				{ new: true }
			).select("_id username");

			res.status(200).json(folderDbRes);
		} catch (err) {
			console.log(err);

			if (err.name === "ValidatorError") {
				res.status(400).json({
					err,
					message: "A name is required."
				});
				return;
			}

			// generic error
			res.status(500).json(err);
		}
	},

	async editFolder(req, res) {
		const folderId = req.params.id;
		const { name, playlists } = req.body;
		const { _id: userId } = checkToken(req, res);

		// check that user is logged in
		if (!userId) {
			res.status(401).json({
				message: "You need to be logged in to do this."
			});
			return;
		}

		// check that user owns this folder
		const belongsToThisUser = await checkFolderOwnership(userId, folderId);

		if (!belongsToThisUser) {
			res.status(401).json({
				message: "You can't edit someone else's playlist."
			});
			return;
		}

		// attempt to update
		try {
			const folderDbRes = await Folder.findOneAndUpdate(
				{ _id: folderId },
				{
					name: name,
					dateLastModified: new Date(),
					playlists: [...playlists]
				},
				{ new: true }
			);

			if (!folderDbRes) {
				res.status(404).json({ message: "No folder with that ID." });
				return;
			}

			res.status(200).json(folderDbRes);
		} catch (err) {
			console.log(err);

			if (err.name === "ValidatorError") {
				res.status(400).json({
					err,
					message: "A name is required."
				});
				return;
			}

			// generic error
			res.status(500).json(err);
		}
	},

	async deleteFolder(req, res) {
		const folderId = req.params.id;
		const { _id: userId } = checkToken(req, res);

		// check that user is logged in
		if (!userId) {
			res.status(401).json({
				message: "You need to be logged in to do this."
			});
			return;
		}

		// check that user owns this folder
		const belongsToThisUser = await checkFolderOwnership(userId, folderId);

		if (!belongsToThisUser) {
			res.status(401).json({
				message: "You can't delete someone else's folder."
			});
			return;
		}

		// make sure they aren't trying to delete their unsorted folder
		try {
			const thisFolder = await Folder.findOne({ _id: folderId });
			const thisFolderIsUnsorted = thisFolder.isUnsorted;

			if (thisFolderIsUnsorted) {
				res.status(401).json({
					message: "You can't delete the Unsorted folder."
				});
				return;
			}
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}

		// attempt to delete
		try {
			const folderDbRes = await Folder.findOneAndDelete({
				_id: folderId
			});

			if (!folderDbRes) {
				res.status(404).json({ message: "No folder with that ID." });
				return;
			}

			// remove deleted folder from relevant user's profile
			const userDbRes = await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { folders: folderId } },
				{ new: true }
			).populate("folders");

			// move playlists that were in this folder to the unsorted folder
			// should always be the first item in the array
			const unsortedFolderId = userDbRes.folders[0];
			const playlistsToMove = folderDbRes.playlists;

			await Folder.findOneAndUpdate(
				{ _id: unsortedFolderId },
				{ $addToSet: { playlists: { $each: [...playlistsToMove] } } },
				{ new: true }
			);

			res.status(200).json({
				deletedFolder: folderDbRes,
				user: userDbRes
			});
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}
};

module.exports = folderController;
