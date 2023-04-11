import { useState } from 'react';

import {useUserContext, useModalContext} from '../hooks';

function Login() {
	const [formState, setFormState] = useState({
		username: '',
		password: ''
	});
	const { setUser } = useUserContext();
	const { modal, setModal } = useModalContext();

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value.trim()
		});
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		// validate
		const { username, password } = formState;

		if (!username || !password) {
			setModal({
				...modal,
				active: 'modal',
				msg: 'A username and password are required.'
			});

			return;
		}

		try {
			const response = await fetch('/api/users/login', {
				method: 'POST',
				body: JSON.stringify(formState),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});
			// returns session and user info
			const json = await response.json();

			if (!response.ok) {
				const { message } = json;

				throw Error(message);
			}

			// update context
			setUser({
				user_id: json.session.user_id,
				username: json.session.username
			});

			setModal({
				...modal,
				active: 'modal',
				msg: "You're logged in! Redirecting...",
				navTo: '/playlists'
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

	return (
		<>
			<div className="page-title">
				<h2>Log In to Setlist</h2>
			</div>

			<form id="user-form" onSubmit={onSubmitHandler}>
				<label htmlFor="username" className="form-label">
					Username{' '}
					<span className="required" title="Required">
						*
					</span>
				</label>
				<input
					id="username"
					name="username"
					className="form-control"
					value={formState.username}
					onChange={onChangeHandler}
				/>

				<label htmlFor="password" className="form-label">
					Password{' '}
					<span className="required" title="Required">
						*
					</span>
				</label>
				<input
					id="password"
					name="password"
					type="password"
					className="form-control"
					value={formState.password}
					onChange={onChangeHandler}
				/>

				<hr className="border-stone-400/50" />

				<button type="submit" className="rectangle-btn">
					Submit
				</button>
			</form>
		</>
	);
}

export default Login;
