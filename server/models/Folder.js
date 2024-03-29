const {Schema, model} = require('mongoose');

const FolderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        dateCreated: {
            type: Date,
            default: new Date,
            required: true
        },
        dateLastModified: {
            type: Date,
            default: new Date,
            required: true
        },
        playlists: [{
            type: Schema.Types.ObjectId,
            ref: 'Playlist'
        }],
        isUnsorted: {
            type: Boolean,
            default: false,
            required: true
        },
        // can't make these required because of some shenanigans in the postUser function
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        uploaderUsername: {
            type: String,
            ref: 'User'
        }
    }
);

FolderSchema.pre('findOneAndUpdate', function(next) {
    this.set({dateLastModified: new Date});

    next();
});

const Folder = model('Folder', FolderSchema);

module.exports = Folder;