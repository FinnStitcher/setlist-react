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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useNavigate } from 'react-router-dom';

import {
	handleDragStart,
	handleDragOver,
	handleDragEnd
} from '../utils/sortableListUtils';

import SongList from './SongList.jsx';
import Song from './Song.jsx';
import Modal from './Modal.jsx';

function PlaylistForm({ plData }) {
	const [formState, setFormState] = useState({
		title: '',
		search: '',
		selected: [],
		deselected: []
	});
	const [activeId, setActiveId] = useState('');

	const [modal, setModal] = useState(false);
	const [modalMsg, setModalMsg] = useState('');

	const navigate = useNavigate();

	// if we got data from the parent component, update state
	useEffect(() => {
		if (plData) {
			setFormState({
				...formState,
				...plData
			});
		}
	}, [plData]);

	// make searches when the search bar contents update
	useEffect(() => {
		async function getSearchResults() {
			const response = await fetch(
				'/api/songs/search/' + formState.search
			);
			const json = await response.json();

			setFormState({
				...formState,
				deselected: [...json]
			});
		}

		if (formState.search) {
			getSearchResults();
		}
	}, [formState.search]);

	function openModal(message) {
		const $modal = document.querySelector('#modal');

		$modal.showModal();
		setModal(true);
		setModalMsg(message);
	}

	function handleNavigate() {
		navigate('/playlists');
	}

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value
		});

		console.log(formState);
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		// validate form state
		if (!formState.title) {
			openModal('Your playlist needs a title.');

			return;
		}

		// create object to send to db
		const playlistObj = {
			title: formState.title,
			songs: formState.selected.map(el => el._id)
		};

		console.log(playlistObj);

		// check - are we making an edit or a new playlist?
		let editingBoolean = window.location.pathname.includes('edit');

		let response = null;

		if (editingBoolean) {
			const playlistId = window.location.pathname.split('/')[2];

			// make api call to update
			response = await fetch('/api/playlists/' + playlistId, {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(playlistObj)
			});
		} else {
			// make api call to create new
			response = await fetch('/api/playlists', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(playlistObj)
			});
		}

		const json = await response.json();

		if (!response.ok) {
			const { message: errMsg } = json;

			openModal(errMsg);

			console.log(response);

			return;
		}

		console.log(json);

		openModal('Success! Your playlist has been updated. Redirecting...');

		setTimeout(() => handleNavigate(), 2000);
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
						<label htmlFor="title" className="form-label">
							Title{' '}
							<span className="required" title="Required">
								*
							</span>
						</label>
						<input
							id="title"
							name="title"
							className="form-control"
							value={formState.title}
							onChange={onChangeHandler}
						/>
					</div>

					<hr />

					<div>
						<label className="form-label">Songs</label>

						<p>
							Click and drag to sort and move songs in and out of
							your playlist.
						</p>

						<SongList id="selected" items={formState.selected} />

						<label htmlFor="search" className="block mb-0.5">
							Search:
						</label>
						<input
							id="search"
							name="search"
							className="form-control"
							autoComplete="off"
							value={formState.search}
							onChange={onChangeHandler}
						/>

						<SongList
							id="deselected"
							items={formState.deselected}
						/>

						<DragOverlay>
							{activeId ? <Song id={activeId} /> : null}
						</DragOverlay>
					</div>

					<hr />

					<button type="submit" className="rectangle-btn">
						Submit
					</button>
				</form>
			</DndContext>

			<Modal setModal={setModal} modalMsg={modalMsg} handleNavigate={handleNavigate} />
		</>
	);
}

export default PlaylistForm;
