import { useState, useContext } from 'react';
import { redirect } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

function Login() {
	const [formState, setFormState] = useState({
        username: '',
        password: ''
    });
    const {setUser} = useContext(UserContext);

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value
		});
	};

    async function onSubmitHandler(event) {
        event.preventDefault();

        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(formState),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (response.ok) {
            console.log('yay you did it');
            console.log(json);

            // change context
            setUser(formState);

			// redirect
			return redirect('/');
        } else {
            console.log('uh oh you didnt do it');
        }
    }

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
