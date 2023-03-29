import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// need to have individual properties vs. an object because it's draggable
function SongDraggable({id, title, artist, album, year}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
	    <li className="my-0" ref={setNodeRef} style={style} {...attributes} {...listeners}>
	        <p className="font-medium">{title}</p>

	        <p className="text-neutral-700 font-normal">
	            {artist}
	            {year && (`, ${year}`)}
	            {album && <>, <i>{album}</i></>}
	        </p>
	    </li>
	)
}

export default SongDraggable;
