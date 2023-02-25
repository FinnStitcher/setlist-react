import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

function Login() {
	const [formState, setFormState] = useState({
        username: '',
        password: ''
    });
    const [redirect, setRedirect] = useState(false);

    const {setUser} = useContext(UserContext);

    if (redirect) {
        return <Navigate to="/playlists" />
    }

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value.trim()
		});
	};

    async function onSubmitHandler(event) {
        event.preventDefault();

        // validate
        const {username, password} = formState;

        if (!username || !password) {
            console.log('whoops');
            return;
        }

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

        if (response.ok) {
            // update context
            setUser({
                user_id: json.session.user_id,
                username: json.session.username
            });

            // redirect
            setTimeout(() => {
                setRedirect(true);
            }, 2000);
        } else {
            console.log('uh oh you didnt do it');
            console.log(json);
        }
    };

	return (
		<>
			<div className="mb-4">
				<h2 className="page-title">Log In to Setlist</h2>
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
