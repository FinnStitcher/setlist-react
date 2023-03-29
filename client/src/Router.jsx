import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ReachOut from "./pages/ReachOut.jsx";

import SingleUser from "./pages/SingleUser.jsx";

import ManagePlaylists from "./pages/playlists/ManagePlaylists.jsx";
import NewPlaylist from "./pages/playlists/NewPlaylist.jsx";
import EditPlaylist from "./pages/playlists/EditPlaylist.jsx";
import SinglePlaylist from "./pages/playlists/SinglePlaylist.jsx";

import ManageFolders from "./pages/folders/ManageFolders.jsx";
import NewFolder from "./pages/folders/NewFolder.jsx";
import EditFolder from "./pages/folders/EditFolder.jsx";

import NewSong from "./pages/songs/NewSong.jsx";
import EditSong from "./pages/songs/EditSong.jsx";

function Router() {
	return (
		<Routes>
			<>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/reach-out" element={<ReachOut />} />
			</>
			<>
				<Route path="/users/:id" element={<SingleUser />} />
			</>
			<>
				<Route path="/playlists" element={<ManagePlaylists />} />
				<Route path="/playlists/:id" element={<SinglePlaylist />} />
				<Route path="/new-playlist" element={<NewPlaylist />} />
				<Route path="/edit-playlist/:id" element={<EditPlaylist />} />
			</>
			<>
				<Route path="/folders" element={<ManageFolders />} />
				<Route path="/new-folder" element={<NewFolder />} />
				<Route path="/edit-folder/:id" element={<EditFolder />} />
			</>
			<>
				<Route path="/new-song" element={<NewSong />} />
				<Route path="/edit-song" element={<EditSong />} />
			</>
		</Routes>
	);
}

export default Router;
