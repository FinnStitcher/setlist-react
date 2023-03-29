import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ReachOut from "./pages/ReachOut.jsx";

const SingleUser = lazy(() => import("./pages/SingleUser.jsx"));

const ManagePlaylists = lazy(() =>
	import("./pages/playlists/ManagePlaylists.jsx")
);
const NewPlaylist = lazy(() => import("./pages/playlists/NewPlaylist.jsx"));
const EditPlaylist = lazy(() => import("./pages/playlists/EditPlaylist.jsx"));
const SinglePlaylist = lazy(() =>
	import("./pages/playlists/SinglePlaylist.jsx")
);

const ManageFolders = lazy(() => import("./pages/folders/ManageFolders.jsx"));
const NewFolder = lazy(() => import("./pages/folders/NewFolder.jsx"));
const EditFolder = lazy(() => import("./pages/folders/EditFolder.jsx"));

const NewSong = lazy(() => import("./pages/songs/NewSong.jsx"));
const EditSong = lazy(() => import("./pages/songs/EditSong.jsx"));

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
				<Route path="/new-playlist" element={<NewPlaylist />} />
				<Route path="/edit-playlist/:id" element={<EditPlaylist />} />
				<Route path="/playlists/:id" element={<SinglePlaylist />} />
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
