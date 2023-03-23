function Song({song}) {
    const {title, artist, album, year} = song;

	return (
	    <li className="my-0">
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
