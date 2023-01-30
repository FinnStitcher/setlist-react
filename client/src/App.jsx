import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Header from './components/Header.jsx';

import Landing from './pages/Landing.jsx';
import Playlists from './pages/Playlists.jsx';

function App() {
  return (
    <BrowserRouter>
        <Header />

        <main className="px-6 py-4">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/playlists" element={<Playlists />} />
            </Routes>
        </main>
    </BrowserRouter>
  )
}

export default App;