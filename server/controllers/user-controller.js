const { User, Folder } = require("../models");
const { signToken } = require("../utils/auth.js");

require("dotenv").config();

const userController = {
	async getAllUsers(req, res) {
		try {
			const dbRes = await User.find({}).select("-__v -password");
			res.status(200).json(dbRes);
		} catch (err) {
			// catch server errors
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getOneUser(req, res) {
		const searchTerm = req.params.id;

		try {
			const dbRes = await User.findOne({
				_id: searchTerm
			})
				.select("-__v -password")
				.populate({
					path: "folders",
					select: "-__v -username",
					populate: {
						path: "playlists",
						select: "-__v -username",
						populate: {
							path: "songs",
							select: "-__v"
						}
					}
				});

			// user was not found
			if (!dbRes) {
				res.status(404).json({ message: "User not found." });
				return;
			}

			res.status(200).json(dbRes);
		} catch (err) {
			// catch server errors
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getOneUserPlaylists(req, res) {
		const searchTerm = req.params.id;

		try {
			const dbRes = await User.findOne({
				_id: searchTerm
			})
				.select("playlists")
				.populate({
					path: "playlists"
				});

			// user was not found
			if (!dbRes) {
				res.status(404).json({ message: "User not found." });
				return;
			}

			res.status(200).json(dbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getOneUserUnsorted(req, res) {
		const searchTerm = req.params.id;

		try {
			const dbRes = await User.findOne({
				_id: searchTerm
			})
				.select("folders")
				.populate({
					path: "folders",
					populate: {
						path: "playlists",
						select: "_id title songs"
					}
				});

			// user was not found
			if (!dbRes) {
				res.status(404).json({ message: "User not found." });
				return;
			}

			// folders[0] should always be 'Unsorted'
			// might benefit from some error handling here later
			const unsortedFolder = dbRes.folders[0];

			res.status(200).json(unsortedFolder);
		} catch (err) {
			console.log(err);
			res.statsu(500).json(err);
		}
	},

	async postUser(req, res) {
		const { username, password } = req.body;

		try {
			// check if a user with this username already exists
			const userWithThisUsername = await User.findOne({
				username: username
			});

			if (userWithThisUsername) {
				res.status(403).json({ message: "This username is taken." });
				return;
			}

			// create 'Unsorted' folder for this user
			const { _id: unsortedFolderId } = await Folder.create({
				name: "Unsorted",
				isUnsorted: true
			});

			const userDbRes = await User.create({
				username,
				password,
				folders: [unsortedFolderId]
			});

			// add uploadedBy property to unsorted folder
			await Folder.findOneAndUpdate(
				{ _id: unsortedFolderId },
				{ uploadedBy: userDbRes._id, uploaderUsername: userDbRes.username }
			);

            const token = signToken(userDbRes._id, userDbRes.username);

            res.status(200).json({
                user: {
                    _id: userDbRes._id,
                    username: userDbRes.username
                },
                token: token,
                message: "User created. You're logged in."
            });
		} catch (err) {
			// catch server errors
			console.log(err);
			res.status(500).json(err);
		}
	},

	async loginUser(req, res) {
		const { username, password } = req.body;

		try {
			// check if this user exists
			const dbRes = await User.findOne({
				username: username
			});

			// user does not exist
			if (!dbRes) {
				res.status(404).json({
					message: "No user with that username."
				});
				return;
			}

			// user does exist
			// check if password is valid
			const isPassValid = await dbRes.comparePassword(password);

			if (!isPassValid) {
				res.status(403).json({ message: "Password is incorrect." });
				return;
			}

			// password was valid

            const token = signToken(dbRes._id, dbRes.username);

            res.status(200).json({
                user: {
                    _id: dbRes._id,
                    username: dbRes.username
                },
                token: token,
                message: "You're logged in."
            });
		} catch (err) {
			// catch server errors
			console.log(err);
			res.status(500).json(err);
		}
	}
};

module.exports = userController;
