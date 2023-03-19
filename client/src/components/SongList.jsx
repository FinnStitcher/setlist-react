import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';

import Song from './Song.jsx';

function SongList({ id, items }) {
	const { setNodeRef } = useDroppable({ id: id });

	return (
		<SortableContext
			id={id}
			items={items}
			strategy={verticalListSortingStrategy}
		>
			<ul className="form-song-list" id={id} ref={setNodeRef}>
				{items.map(item => (
					<Song key={item._id} id={item._id} />
				))}
			</ul>
		</SortableContext>
	);
}

export default SongList;
