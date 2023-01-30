import {Link} from 'react-router-dom';

function Header() {
    return (
        <header className="bg-stone-400 py-2.5">
            <h1 className="text-xl text-center">SETLIST</h1>

            <nav className="flex flex-row flex-wrap justify-start px-3 sm:px-6">
                <div className="nav-link">
                    <Link to="/playlists">My Playlists</Link>
                </div>
                <div className="nav-link">
                    <Link to="/add-song">Submit a Song</Link>
                </div>
                <div className="nav-link">
                    <button type="button" id="logout">Logout</button>
                </div>
            </nav>
        </header>
    )
};

export default Header;