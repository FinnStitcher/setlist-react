import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Song(props) {
	//const { title, artist, year, album } = props.song;

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div ref={setNodeRef} {...attributes} {...listeners}>
			{props.id}
		</div>
	);

	// return (
	//     <li className="my-0">
	//         <p className="font-medium">{title}</p>

	//         <p className="text-neutral-700 font-normal">
	//             {artist}
	//             {year && (`, ${year}`)}
	//             {album && <>, <i>{album}</i></>}
	//         </p>
	//     </li>
	// )
}

export default Song;
