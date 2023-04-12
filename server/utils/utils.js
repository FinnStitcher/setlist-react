const {User} = require('../models');

async function checkUserOwnership(userId, playlistId) {
    if (!userId) {
        return false;
    }

    const thisUserData = await User.findOne({
        _id: userId
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    if (thisUserData.playlists.includes(playlistId)) {
        return true;
    } else {
        return false;
    }
};

async function checkFolderOwnership(userId, folderId) {
    if (!userId) {
        return false;
    }

    const thisUserData = await User.findOne({
        _id: userId
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    if (thisUserData.folders.includes(folderId)) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    checkUserOwnership,
    checkFolderOwnership
};