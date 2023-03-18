import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';

import Song from './Song.jsx';

function SongList(props) {
	const { id, items } = props;

	const { setNodeRef } = useDroppable({
		id
	});

	return (
		<SortableContext
			id={id}
			items={items}
			strategy={verticalListSortingStrategy}
		>
			<div className="form-song-list" ref={setNodeRef}>
				{items.map(id => (
					<Song key={id} id={id} />
				))}
			</div>
		</SortableContext>
	);
}

export default SongList;
