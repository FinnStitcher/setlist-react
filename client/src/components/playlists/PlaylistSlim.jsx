function PlaylistSlim({playlist}) {
    return (
        <li className="my-0">
            <p className="font-medium">{playlist.title}</p>
            <p className="text-neutral-700 font-normal">{playlist.songs.length} tracks</p>
        </li>
    )
};

export default PlaylistSlim;