const router = require('express').Router();

// /api/users

const {
	getAllUsers,
	getOneUser,
    getOneUserPlaylists,
    getOneUserUnsorted,
	getThisUserId,
	postUser,
	loginUser
} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers).post(postUser);
router.route('/login').post(loginUser);
router.route('/:id').get(getOneUser);
router.route('/:id/playlists').get(getOneUserPlaylists);
router.route('/:id/playlists/unsorted').get(getOneUserUnsorted);

module.exports = router;
