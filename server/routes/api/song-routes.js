const router = require('express').Router();

// /api/songs

const {
    getAllSongs,
    getOneSong,
    getSongsByUser,
    getSongsByTitle,
    getSongsByTitleAndArtist,
    postSong,
    putSong
} = require('../../controllers/song-controller');

router.route('/').get(getAllSongs).post(postSong);
router.route('/search/title').get(getSongsByTitle);
router.route('/search/title/artist').get(getSongsByTitleAndArtist);
router.route('/search/user').get(getSongsByUser);
router.route('/:id').get(getOneSong).put(putSong);

module.exports = router;