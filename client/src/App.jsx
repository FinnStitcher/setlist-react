import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import ModalContext from './ModalContext.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ReachOut from './pages/ReachOut.jsx';

import ManagePlaylists from './pages/playlists/ManagePlaylists.jsx';
import NewPlaylist from './pages/playlists/NewPlaylist.jsx';
import EditPlaylist from './pages/playlists/EditPlaylist.jsx';

import ManageFolders from './pages/folders/ManageFolders.jsx';
import NewFolder from './pages/folders/NewFolder.jsx';
import EditFolder from './pages/folders/EditFolder.jsx';

import NewSong from './pages/songs/NewSong.jsx';
import EditSong from './pages/songs/EditSong.jsx';

import SinglePlaylist from './pages/playlists/SinglePlaylist.jsx';
import SingleUser from './pages/SingleUser.jsx';

import Header from './components/layout/Header.jsx';
import Modal from './components/layout/Modal';

function App() {
	const [user, setUser] = useState(null);
	const [modal, setModal] = useState({
		active: '',
		msg: '',
        navTo: '/'
	});

	return (
		<BrowserRouter>
			<UserContext.Provider value={{ user, setUser }}>
				<ModalContext.Provider value={{ modal, setModal }}>
					<Header />
                    
					<main className="px-6 py-4">
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route
								path="/playlists"
								element={<ManagePlaylists />}
							/>
                            <Route path="/folders" element={<ManageFolders />} />
							<Route
								path="/new-playlist"
								element={<NewPlaylist />}
							/>
							<Route
								path="/edit-playlist/:id"
								element={<EditPlaylist />}
							/>
							<Route
								path="/new-folder"
								element={<NewFolder />}
							/>
							<Route
								path="/edit-folder/:id"
								element={<EditFolder />}
							/>
							<Route
								path="/new-song"
								element={<NewSong />}
							/>
							<Route
								path="/edit-song"
								element={<EditSong />}
							/>
							<Route
								path="/playlists/:id"
								element={<SinglePlaylist />}
							/>
							<Route
								path="/users/:id"
								element={<SingleUser />}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
                            <Route path="/reach-out" element={<ReachOut />} />
						</Routes>
					</main>

                    <Modal id='modal' />
				</ModalContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
