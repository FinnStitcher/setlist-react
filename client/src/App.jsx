import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import ModalContext from './ModalContext.jsx';

import Landing from './pages/Landing.jsx';
import ManagePlaylists from './pages/ManagePlaylists.jsx';
import NewPlaylist from './pages/NewPlaylist.jsx';
import EditPlaylist from './pages/EditPlaylist.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

import Header from './components/Header.jsx';
import Modal from './components/Modal';

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
							<Route
								path="/new-playlist"
								element={<NewPlaylist />}
							/>
							<Route
								path="/edit-playlist/:id"
								element={<EditPlaylist />}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
						</Routes>
					</main>
                    <Modal id='modal' state={modal} setState={setModal} />
				</ModalContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
