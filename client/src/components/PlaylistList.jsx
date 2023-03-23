import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';

import PlaylistDraggable from './PlaylistDraggable.jsx';

function PlaylistList({ id, items }) {
	const { setNodeRef } = useDroppable({ id: id });

	return (
		<SortableContext
			id={id}
			items={items}
			strategy={verticalListSortingStrategy}
		>
			<ul className="form-song-list" id={id} ref={setNodeRef}>
                {items.map(item => {
                    const {_id, title, songs} = item;

                    return <PlaylistDraggable key={_id} id={_id} title={title} trackNumber={songs.length} />
                })}
			</ul>
		</SortableContext>
	);
}

export default PlaylistList;
