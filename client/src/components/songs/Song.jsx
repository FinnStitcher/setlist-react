import { Fragment } from "react";
import { useModalContext } from "../../hooks";

function Song({ song }) {
	const { _id, title, artist, album, year, links } = song;

	const displayLinks = window.location.pathname === "/playlists";

	const { setModal } = useModalContext();

	function ytModalHandler(event) {
		const { href } = event.target.dataset;

		// turn that link into a youtube embed url
		const embedArr = href.split("/watch?v=");
		const embed = embedArr.join("/embed/");

		setModal({
			active: "yt-frame",
			iframe: embed
		});
	}

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

			{displayLinks && links.length > 0 && (
				<p className="text-neutral-700 font-normal">
					Links:{" "}
					{links &&
						links.map((element, index) => {
							const isYtLink = element.href.includes("www.youtube.com");

							if (isYtLink) {
								return (
									<Fragment key={index}>
										<a
											data-href={element.href}
											onClick={ytModalHandler}
											className="cursor-pointer"
										>
											{element.source}
										</a>
										{index < links.length - 1 && ", "}
									</Fragment>
								);
							} else {
								return (
									<Fragment key={index}>
										<a href={element.href}>{element.source}</a>
										{index < links.length - 1 && <span>, </span>}
									</Fragment>
								);
							}
						})}
				</p>
			)}
		</li>
	);
}

export default Song;
