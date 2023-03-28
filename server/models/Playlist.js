const {Schema, model} = require('mongoose');

const PlaylistSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        dateCreated: {
            type: Date,
            default: Date.now
            // TODO: install luxon and make a dateFormat util
        },
        dateLastModified: {
            type: Date,
            default: Date.now
            // TODO: install luxon and make a dateFormat util
        },
        songs: [{
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }],
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        uploaderUsername: {
            type: String,
            ref: 'User'
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

const Playlist = model('Playlist', PlaylistSchema);

module.exports = Playlist;