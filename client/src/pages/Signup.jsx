import { useState } from "react";

import { useUserContext, useModalContext, useFetch } from "../hooks";

function Signup() {
	const [formState, setFormState] = useState({
		username: "",
		password: ""
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
				active: "modal",
				msg: "A username and password are required."
			});

			return;
		}

		try {
			const json = await useFetch("/api/users", "POST", formState); // no token

			// update context
			setUser({
				user_id: json.user._id,
				username: json.user.username,
				token: json.token
			});

			// save to local storage
			localStorage.setItem("setlist_token", json.token);

			setModal({
				...modal,
				active: "modal",
				msg: "You're all signed up! We've automatically logged you in. Redirecting...",
				navTo: "/playlists"
			});
		} catch (err) {
			setModal({
				...modal,
				active: "modal",
				msg: `${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}

	return (
		<>
			<div className="page-title">
				<h2>Sign Up</h2>
			</div>

			<form id="user-form" onSubmit={onSubmitHandler}>
				<label htmlFor="username" className="form-label">
					Username{" "}
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
					Password{" "}
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

export default Signup;
