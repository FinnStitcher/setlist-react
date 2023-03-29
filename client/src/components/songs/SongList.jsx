import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';

import SongDraggable from './SongDraggable.jsx';

function SongList({ id, items }) {
	const { setNodeRef } = useDroppable({ id: id });

	return (
		<SortableContext
			id={id}
			items={items}
			strategy={verticalListSortingStrategy}
		>
			<ul className="form-song-list" id={id} ref={setNodeRef}>
                {items.map(item => {
                    const {_id, title, artist, album, year} = item;

                    return <SongDraggable key={_id} id={_id} title={title} artist={artist} album={album} year={year} />
                })}
			</ul>
		</SortableContext>
	);
}

export default SongList;
