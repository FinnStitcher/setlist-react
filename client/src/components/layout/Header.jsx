import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../UserContext.jsx';
import ModalContext from '../../ModalContext.jsx';

function Header() {
	const { user, setUser } = useContext(UserContext);
    const {setModal} = useContext(ModalContext);
	const navigate = useNavigate();

	async function logoutHandler() {
		// make fetch request to log out the user
		const response = await fetch('/api/users/logout', {
			method: 'DELETE'
		});

		if (!response.ok) {
            setModal({
                ...modal,
                active: 'modal',
                msg: `Something went wrong when logging you out.`
            });

            console.log(response);
            
			return;
		}

		// change context
		setUser(null);

		// redirect
		navigate('/');
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
							<Link to="/folders">My Folders</Link>
						</div>
						<div className="nav-link">
							<Link to="/new-song">Submit Song</Link>
						</div>
						<div className="nav-link">
							<Link to="/edit-song">Edit Song</Link>
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
				<div className="nav-link">
					<Link to="/reach-out">Reach Out</Link>
				</div>
			</nav>
		</header>
	);
}

export default Header;