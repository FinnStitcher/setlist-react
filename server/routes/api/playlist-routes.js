const router = require('express').Router();

// /api/playlists

const {
    getAllPlaylists,
    getOnePlaylist,
    postPlaylist,
    editPlaylist,
    updatePlaylistFolders,
    movePlaylistToUnsorted,
    deletePlaylist
} = require('../../controllers/playlist-controller');

router.route('/').get(getAllPlaylists).post(postPlaylist);
router.route('/:id').get(getOnePlaylist).put(editPlaylist).delete(deletePlaylist);
router.route('/:id/update-folders').put(updatePlaylistFolders);
router.route('/:id/update-folders/unsorted').put(movePlaylistToUnsorted);

module.exports = router;