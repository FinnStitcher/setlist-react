const { Song } = require('../models');
const {checkToken} = require('../utils/auth.js');

const songController = {
	async getAllSongs(req, res) {
		try {
			const songDbRes = await Song.find({});

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getOneSong(req, res) {
		const searchTerm = req.params.id;

		try {
			const songDbRes = await Song.findOne({
				_id: searchTerm
			});

			if (!songDbRes) {
				res.status(404).json({ message: 'No song with that ID.' });
				return;
			}

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getSongsByTitleThisUser(req, res) {
		let { title } = req.query;
        const {_id: userId} = checkToken(req, res);

		if (!userId) {
			res.status(400).json({
				message: 'Missing an ID to search with.'
			});
			return;
		}

        // pre-process to deal with any characters that have special regex meanings
        title = title.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

		// convert search into regex
		const searchRegex = title
			? new RegExp('\\b' + title, 'i')
			: new RegExp('.');

		try {
			const songDbRes = await Song.find({
				uploadedBy: userId,
				title: searchRegex
			});

			if (!songDbRes) {
				// a search turning up nothing is an acceptable result
				res.status(200).json({ message: 'No results.' });
				return;
			}

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

    // TODO remove this and update frontend to search by artist as well
	async getSongsByTitle(req, res) {
        // used to find songs so the user can add them to a playlist

		const searchTerm = req.query.title;
		// convert searchTerm into a regexp
		// requires a word boundary at the start of the search term
		const searchRegex = new RegExp('\\b' + searchTerm, 'i');

		try {
			const songDbRes = await Song.find({
				title: searchRegex
			});

			if (!songDbRes) {
				// status 200 because the search turning up nothing is an expected and acceptable result
				// frontend will tell the user there was nothing
				res.status(200);
				return;
			}

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getSongsByTitleAndArtist(req, res) {
        // used to find songs that might be duplicates of the one the user is trying to create
        let {title, artist} = req.query;

        // pre-process to deal with any characters that have special regex meanings
        title = title.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        artist = artist.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

		// turn query params into regexps
		const titleRegex = title
			? new RegExp('\\b' + title, 'i')
			: new RegExp('.');
		const artistRegex = artist
			? new RegExp('\\b' + artist, 'i')
			: new RegExp('.');

		try {
			const songDbRes = await Song.find({
				$and: [{ title: titleRegex }, { artist: artistRegex }]
			});

			if (!songDbRes) {
				// see rationale in searchSongs()
				res.status(204);
				return;
			}

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async postSong(req, res) {
		const { title, artist, album, year, links } = req.body;
        const {_id: userId} = checkToken(req, res);

		// confirm user is logged in
		if (!userId) {
			res.status(401).json({
				message: 'You need to be logged in to do that.'
			});
			return;
		}

		try {
			const songDbRes = await Song.create({
				title,
				artist,
				album,
				year,
                links,
				uploadedBy: userId
			});

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async putSong(req, res) {
		const { title, artist, album, year, links } = req.body;
		const { id: songId } = req.params;
        const {_id: userId} = checkToken(req, res);

		// confirm user is logged in
		if (!userId) {
			res.status(401).json({
				message: 'You need to be logged in to do that.'
			});
			return;
		}

		try {
			const songDbRes = await Song.findOneAndUpdate(
				{
					_id: songId
				},
				{
                    title,
                    artist,
                    album,
                    year,
                    links
				},
				{ new: true }
			);

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}
};

module.exports = songController;
