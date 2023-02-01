import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContext from './UserContext.jsx';

import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import Playlists from './pages/Playlists.jsx';
import Login from './pages/Login.jsx';

function App() {
    const [user, setUser] = useState(null);

	return (
		<BrowserRouter>
			<UserContext.Provider value={{user, setUser}}>
				<Header />
				<main className="px-6 py-4">
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/playlists" element={<Playlists />} />
                        <Route path="/login" element={<Login />} />
					</Routes>
				</main>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
