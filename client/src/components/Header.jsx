import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext.jsx';

function Header() {
	const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

	async function logoutHandler() {
		// make fetch request to log out the user
		const response = await fetch('/api/users/logout', {
			method: 'DELETE'
		});

		if (response.ok) {
			console.log('yay you did it');

			// change context
			setUser(null);

            // redirect
            // for some reason return <Navigate /> doesn't work here
            navigate('/');
		} else {
			console.log('oh no you didnt do it');
		}
	}

	return (
		<header className="bg-stone-400 py-2.5">
			<h1 className="text-xl text-center">
				<Link to="/">SETLIST</Link>
			</h1>

			<nav className="flex flex-row flex-wrap justify-start px-3 sm:px-6">
				{user ? (
					<>
						<div className="nav-link">
							<Link to="/playlists">My Playlists</Link>
						</div>
						<div className="nav-link">
							<Link to="/add-song">Submit a Song</Link>
						</div>
						<div className="nav-link" onClick={logoutHandler}>
							<button type="button" id="logout">
								Logout
							</button>
						</div>
					</>
				) : (
					<>
						<div className="nav-link">
							<Link to="/login">Log In</Link>
						</div>
						<div className="nav-link">
							<Link to="/signup">Sign Up</Link>
						</div>
					</>
				)}
			</nav>
		</header>
	);
}

export default Header;
