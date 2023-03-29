function Song({song}) {
    const {_id, title, artist, album, year} = song;

	return (
	    <li className="my-0" id={_id}>
	        <p className="font-medium">{title}</p>

	        <p className="text-neutral-700 font-normal">
	            {artist}
	            {year && (`, ${year}`)}
	            {album && <>, <i>{album}</i></>}
	        </p>
	    </li>
	)
}

export default Song;
