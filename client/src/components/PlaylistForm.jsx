import { useState, useEffect } from 'react';
import {
	DndContext,
	DragOverlay,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import SongList from './SongList.jsx';
import Song from './Song.jsx';

function PlaylistForm() {
	const [items, setItems] = useState({
		selected: ['one', 'two', 'three'],
		deselected: ['four', 'five']
	});
	const [activeId, setActiveId] = useState('');

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	function findContainer(id) {
		// id is present in items; therefore, the id refers to a container, so we just return it
		if (id in items) {
			return id;
		}

		// find the key of the container that includes this id
		return Object.keys(items).find(key => items[key].includes(id));
	}

	function handleDragStart(event) {
		const { active } = event;
		const { id } = active;

		setActiveId(id);
	}

	// update the view as items are dragged around
	function handleDragOver(event) {
		const { active, over } = event;
		const { id: activeId } = active;
		const { id: overId } = over;

		console.log(activeId, overId);

		// find what containers are involved
		const activeContainer = findContainer(activeId);
		const overContainer = findContainer(overId);

		// error handling
		if (!activeContainer || !overContainer) {
			return;
		}

		setItems(prev => {
			const activeItems = prev[activeContainer];
			const overItems = prev[overContainer];

			// find indexes of the item being dragged and what its being dragged over
			const activeIndex = activeItems.indexOf(activeId);
			const overIndex = overItems.indexOf(overId);

            // if the object isn't moving containers, just move items around
			if (activeContainer === overContainer) {
				// should make this only run if the indices are different
				return {
					...items,
					[activeContainer]: arrayMove(
						items[activeContainer],
						activeIndex,
						overIndex
					)
				};
			}

            // item is moving containers, time to calculate where it should go

			let newIndex;

			if (overId in prev) {
				console.log('overId is in prev');
				console.log(overId);
				newIndex = overItems.length + 1;
			} else {
				// should we put this item at the bottom of the list?
				const isBelowLastItem =
					over && overIndex === overItems.length - 1;

				const modifier = isBelowLastItem ? 1 : 0;

				// if the item being hovered over has an index in overItems (therefore, is another draggable)
				newIndex =
					overIndex >= 0
						? overIndex + modifier
						: overItems.length + 1;
			}

			return {
				...prev,
				[activeContainer]: [
					...prev[activeContainer].filter(item => item !== active.id)
                    // activeContainer now contains everything it did before minus the active item
				],
				[overContainer]: [
					...prev[overContainer].slice(0, newIndex),
					items[activeContainer][activeIndex],
					...prev[overContainer].slice(
						newIndex,
						prev[overContainer].length
					)
					// overContainer now contains everything it did before with the active item spliced in
				]
			};
		});
	}

	function handleDragEnd(event) {
		const { active, over } = event;
		const { id: activeId } = active;
		const { id: overId } = over;

		const activeContainer = findContainer(activeId);
		const overContainer = findContainer(overId);

        // error handling
        // note that handleDragOver continually updates the ids, so at the end of a drag, activeContainer and overContainer *should* be the same
		if (
			!activeContainer ||
			!overContainer ||
			activeContainer !== overContainer
		) {
			return;
		}

		const activeIndex = items[activeContainer].indexOf(activeId);
		const overIndex = items[overContainer].indexOf(overId);

		if (activeIndex !== overIndex) {
			setItems(items => ({
				...items,
				[overContainer]: arrayMove(
					items[overContainer],
					activeIndex,
					overIndex
				)
			}));
		}

		setActiveId(null);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<form id="pl-form">
				<div>
					<label className="form-label">Songs</label>

					<p>
						Click and drag to sort and move songs in and out of your
						playlist.
					</p>

					<SongList id="selected" items={items.selected} />
					<hr />
					<SongList id="deselected" items={items.deselected} />
					<DragOverlay>
						{activeId ? <Song id={activeId} /> : null}
					</DragOverlay>
					{/* <ul className="form-song-list" id="selected-songs">
						{formState.songs && formState.songs.map(element => (
                            <Song key={element._id} song={element} />
                        ))}
					</ul>

					<hr />

					<ul className="form-song-list" id="search-results">
						{formState.searchSongs && formState.searchSongs.map(element => (
                            <Song key={element._id} song={element} />
                        ))}
					</ul> */}
				</div>
			</form>
		</DndContext>
	);
}

// function PlaylistForm({ plData }) {
//     const [formState, setFormState] = useState({
//         title: '',
//         songs: [],
//         search: '',
//         searchSongs: []
//     });

//     // if we got data from the parent component, update state
//     useEffect(() => {
//         if (plData) {
//             setFormState({
//                 ...formState,
//                 ...plData
//             });

//             // console.log(document.querySelectorAll('#selected-songs li'));
//         }
//     }, [plData]);

//     // make searches when the search bar contents update
//     useEffect(() => {
//         async function getSearchResults() {
//             const response = await fetch('/api/songs/search/' + formState.search);
//             const json = await response.json();

//             setFormState({
//                 ...formState,
//                 searchSongs: [...json]
//             });
//         }

//         if (formState.search) {
//             getSearchResults();
//         }
//     }, [formState.search]);

//     function onChangeHandler(event) {
//         const {name, value} = event.target;

//         setFormState({
//             ...formState,
//             [name]: value
//         });
//     };

// 	return (
// 		<form id="pl-form">
// 			<div>
// 				<label htmlFor="title" className="form-label">
// 					Title{' '}
// 					<span className="required" title="Required">
// 						*
// 					</span>
// 				</label>
// 				<input
// 					id="title"
// 					name="title"
// 					className="form-control"
//                     value={formState.title}
//                     onChange={onChangeHandler}
// 				/>
// 			</div>

// 			<hr />

// 			<div>
// 				<label className="form-label">Songs</label>

// 				<p>Click and drag to sort and move songs in and out of your playlist.</p>

// 				<ul className="form-song-list" id="selected-songs">
//                     {formState.songs && formState.songs.map(element => (
//                         <Song key={element._id} song={element} />
//                     ))}
//                 </ul>

// 				<label htmlFor="search" className="block mb-0.5">
// 					Search:
// 				</label>
// 				<input
// 					id="search"
// 					name="search"
// 					className="form-control"
// 					autoComplete="off"
//                     value={formState.search}
//                     onChange={onChangeHandler}
// 				/>

// 				<ul className="form-song-list" id="search-results">
//                     {formState.searchSongs && formState.searchSongs.map(element => (
//                         <Song key={element._id} song={element} />
//                     ))}
//                 </ul>
// 			</div>

// 			<hr />

// 			<button type="submit" className="rectangle-btn">
// 				Submit
// 			</button>
// 		</form>
// 	);
// }

export default PlaylistForm;
