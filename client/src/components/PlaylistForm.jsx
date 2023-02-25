import { useState, useEffect } from 'react';
import Song from './Song.jsx';

function PlaylistForm({ plData }) {
    const [formState, setFormState] = useState({
        title: '',
        songs: [],
        search: '',
        searchSongs: []
    });
    
    // if we got data from the parent component, update state
    useEffect(() => {
        if (plData) {
            setFormState({
                ...formState,
                ...plData
            });

            // console.log(document.querySelectorAll('#selected-songs li'));
        }
    }, [plData]);

    // make searches when the search bar contents update
    useEffect(() => {
        async function getSearchResults() {
            const response = await fetch('/api/songs/search/' + formState.search);
            const json = await response.json();
            
            setFormState({
                ...formState,
                searchSongs: [...json]
            });
        }

        if (formState.search) {
            getSearchResults();
        }
    }, [formState.search]);

    function onChangeHandler(event) {
        const {name, value} = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

	return (
		<form id="pl-form">
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

				<p>Click and drag to sort and move songs in and out of your playlist.</p>

				<ul className="form-song-list" id="selected-songs">
                    {formState.songs && formState.songs.map(element => (
                        <Song key={element._id} song={element} />
                    ))}
                </ul>

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

				<ul className="form-song-list" id="search-results">
                    {formState.searchSongs && formState.searchSongs.map(element => (
                        <Song key={element._id} song={element} />
                    ))}
                </ul>
			</div>

			<hr />

			<button type="submit" className="rectangle-btn">
				Submit
			</button>
		</form>
	);
}

export default PlaylistForm;
