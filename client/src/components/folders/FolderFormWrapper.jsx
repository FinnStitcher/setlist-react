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
    const [activeData, setActiveData] = useState({});

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
					handleDragStart(e, setActiveId, setActiveData);
				}}
				onDragOver={(e) => {
					handleDragOver(e, formState, setFormState);
				}}
				onDragEnd={(e) => handleDragEnd(e, formState, setFormState, setActiveId, setActiveData)}
			>
				<FolderForm flData={flData} formState={formState} setFormState={setFormState} />

				<DragOverlay>{activeId ? <PlaylistDraggable id={activeId} title={activeData.title} trackNumber={activeData.songs.length} /> : null}</DragOverlay>
			</DndContext>
		</>
	);
}

export default FolderFormWrapper;
