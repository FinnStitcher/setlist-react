import { useState, useEffect, useContext } from 'react';
import {
	DndContext,
	DragOverlay,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useNavigate } from 'react-router';

import {
	handleDragStart,
	handleDragOver,
	handleDragEnd
} from '../../utils/sortableListUtils';

import UserContext from '../../UserContext.jsx';
import ModalContext from '../../ModalContext.jsx';

import PlaylistList from '../playlists/PlaylistList.jsx';
import PlaylistDraggable from '../playlists/PlaylistDraggable.jsx';

function FolderForm({ flData }) {
	const [formState, setFormState] = useState({
		name: '',
		selected: [],
		deselected: []
	});
	const [activeId, setActiveId] = useState('');

	const { user } = useContext(UserContext);
	const { modal, setModal } = useContext(ModalContext);

	const navigate = useNavigate();

	// get data and set state
	useEffect(() => {
		async function getUnsortedPlaylists() {
			const { user_id } = user;

			try {
				const response = await fetch(
					'/api/users/' + user_id + '/playlists/unsorted'
				);
				const json = await response.json();

				if (!response.ok) {
					const { message } = json;

					throw Error(message);
				}

                // include any data received from the parent component
				setFormState({
					...formState,
                    ...flData,
					deselected: [...json.playlists]
				});
			} catch (err) {
                setModal({
                    ...modal,
                    active: 'modal',
                    msg: `${err.name}: ${err.message}`
                });
                
				console.log(err);
			}
		}

		getUnsortedPlaylists();
	}, [flData]);

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value
		});
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		// validate form state
		if (!formState.name) {
			setModal({
				...modal,
				active: 'modal',
				msg: 'Your folder needs a name.',
				navTo: ''
			});

			return;
		}

		// create object to send to db
		const folderObj = {
			name: formState.name,
			playlists: formState.selected.map(el => el._id)
		};

		// check - are we making an edit or a new folder?
		let editingBoolean = window.location.pathname.includes('edit');

		let response = null;

		try {
			if (editingBoolean) {
				const folderId = window.location.pathname.split('/')[2];

				// make api call to update
				response = await fetch('/api/folders/' + folderId, {
					method: 'PUT',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(folderObj)
				});
			} else {
				// make api call to create new
				response = await fetch('/api/folders', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(folderObj)
				});
			}
			const json = await response.json();

			if (!response.ok) {
				const { message } = json;

				throw Error(message);
			}

			// remove selected playlists from any other folders
			formState.selected.forEach(async element => {
				const folderId = window.location.pathname.split('/')[2];

				const updateResponse = await fetch(
					'/api/playlists/' + element._id + '/update-folders',
					{
						method: 'PUT',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ folderId: folderId })
					}
				);
				const updateJson = await updateResponse.json();

				if (!response.ok) {
					const { message } = updateJson;

					throw Error(message);
				}
			});

			// make sure deselected playlists are in Unsorted
			formState.deselected.forEach(async element => {
				const updateResponse = await fetch(
					'/api/playlists/' +
						element._id +
						'/update-folders/unsorted',
					{
						method: 'PUT',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						}
					}
				);
				const updateJson = await updateResponse.json();

				if (!response.ok) {
					const { message } = updateJson;

					throw Error(message);
				}
			});

			setModal({
				...modal,
				active: 'modal',
				msg: `Success! Your folder has been ${
					editingBoolean ? 'updated' : 'created'
				}. Redirecting...`,
				navTo: '/folders'
			});
		} catch (err) {
			setModal({
				...modal,
				active: 'modal',
				msg: `${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}

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
				onDragStart={e => {
					handleDragStart(e, setActiveId);
				}}
				onDragOver={e => {
					handleDragOver(e, formState, setFormState);
				}}
				onDragEnd={e =>
					handleDragEnd(e, formState, setFormState, setActiveId)
				}
			>
				<form id="pl-form" onSubmit={onSubmitHandler}>
					<div>
						<label htmlFor="name" className="form-label">
							Name{' '}
							<span className="required" title="Required">
								*
							</span>
						</label>
						<input
							id="name"
							name="name"
							className="form-control"
							value={formState.name}
							onChange={onChangeHandler}
						/>
					</div>

					<hr />

					<div>
						<label className="form-label">Playlists</label>

						<p>
							Click and drag to sort playlists, and move them in
							and out of this folder.
						</p>

						<PlaylistList
							id="selected"
							items={formState.selected}
						/>

						<hr />

						{/* <label htmlFor="search" className="block mb-0.5">
							Search:
						</label>
						<input
							id="search"
							name="search"
							className="form-control"
							autoComplete="off"
							value={formState.search}
							onChange={onChangeHandler}
						/> */}

						<PlaylistList
							id="deselected"
							items={formState.deselected}
						/>

						<DragOverlay>
							{activeId ? (
								<PlaylistDraggable id={activeId} />
							) : null}
						</DragOverlay>
					</div>

					<hr />

					<button type="submit" className="rectangle-btn">
						Submit
					</button>
				</form>
			</DndContext>
		</>
	);
}

export default FolderForm;
