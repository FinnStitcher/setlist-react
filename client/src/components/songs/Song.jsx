function Song({ song }) {
	const { _id, title, artist, album, year, links } = song;

	return (
		<li className="my-0" id={_id}>
			<p className="font-medium">{title}</p>

			<p className="text-neutral-700 font-normal">
				{artist}
				{year && `, ${year}`}
				{album && (
					<>
						, <i>{album}</i>
					</>
				)}
			</p>

			<p className="text-neutral-700 font-normal">
                Links:{" "}
				{links &&
					links.map((element, index) => (
						<>
							<a key={index} href={element.href}>
								{element.source}
							</a>
                            {index < links.length - 1 && <span>, </span>}
						</>
					))}
			</p>
		</li>
	);
}

export default Song;
