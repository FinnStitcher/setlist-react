import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// need to have individual props vs. an object prop because it's draggable
function PlaylistDraggable({id, title, trackNumber}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
	    <li className="my-0" ref={setNodeRef} style={style} {...attributes} {...listeners}>
	        <p className="font-medium">{title}</p>

	        <p className="text-neutral-700 font-normal">{trackNumber} tracks</p>
	    </li>
	)
}

export default PlaylistDraggable;
