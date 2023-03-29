import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { handleDragStart, handleDragOver, handleDragEnd } from "../../utils/sortableListUtils";

import PlaylistForm from './PlaylistForm.jsx';
import SongDraggable from "../songs/SongDraggable.jsx";

function PlaylistFormWrapper({plData}) {
	const [formState, setFormState] = useState({
		title: "",
		search: "",
		selected: [],
		deselected: []
	});
	const [activeId, setActiveId] = useState("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={(e) => {
					handleDragStart(e, setActiveId);
				}}
				onDragOver={(e) => {
					handleDragOver(e, formState, setFormState);
				}}
				onDragEnd={(e) => handleDragEnd(e, formState, setFormState, setActiveId)}
			>
				<PlaylistForm plData={plData} formState={formState} setFormState={setFormState} />

				<DragOverlay>{activeId ? <SongDraggable id={activeId} /> : null}</DragOverlay>
			</DndContext>
		</>
	);
}

export default PlaylistFormWrapper;
