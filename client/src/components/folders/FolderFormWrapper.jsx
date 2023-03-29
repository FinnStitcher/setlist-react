import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { handleDragStart, handleDragOver, handleDragEnd } from "../../utils/sortableListUtils";

import FolderForm from "./FolderForm.jsx";
import PlaylistDraggable from "../playlists/PlaylistDraggable.jsx";

function FolderFormWrapper({ flData }) {
	const [formState, setFormState] = useState({
		name: "",
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
				<FolderForm flData={flData} formState={formState} setFormState={setFormState} />

				<DragOverlay>{activeId ? <PlaylistDraggable id={activeId} /> : null}</DragOverlay>
			</DndContext>
		</>
	);
}

export default FolderFormWrapper;
