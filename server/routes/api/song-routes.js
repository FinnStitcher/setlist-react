const router = require('express').Router();

// /api/songs

const {
    getAllSongs,
    getOneSong,
    getSongsByTitleThisUser,
    getSongsByTitle,
    getSongsByTitleAndArtist,
    postSong,
    putSong
} = require('../../controllers/song-controller');

router.route('/').get(getAllSongs).post(postSong);
router.route('/search/title').get(getSongsByTitle);
router.route('/search/title/artist').get(getSongsByTitleAndArtist);
router.route('/search/user/title').get(getSongsByTitleThisUser);
router.route('/:id').get(getOneSong).put(putSong);

module.exports = router;