import { Suspense, useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./UserContext.jsx";
import ModalContext from "./ModalContext.jsx";

import Router from "./Router.jsx";
import Loading from "./Loading.jsx";

import Header from "./components/layout/Header.jsx";
import Modal from "./components/layout/Modal";
import Iframe from "./components/layout/Iframe";

import Auth from "./utils/auth.js";

function App() {
	const [user, setUser] = useState(null);
	const [modal, setModal] = useState({
		active: "",
		msg: "",
		navTo: ""
	});

	useEffect(() => {
		async function initUserData() {
			// check for stored data
			const token = Auth.getToken();

			if (!token) {
				return;
			}

			const tokenExpired = Auth.isTokenExpired(token);

			// token was expired
			if (tokenExpired) {
				return;
			}

			// get data from token
			const { _id, username } = await Auth.decodeToken(token).data;

			setUser({
				user_id: _id,
				username: username,
				token: token
			});
		}

        initUserData();
	}, []);

	return (
		<BrowserRouter>
			<UserContext.Provider value={{ user, setUser }}>
				<ModalContext.Provider value={{ modal, setModal }}>
					<Header />

					<main className="px-6 py-4">
						<Suspense fallback={<Loading />}>
							<Router />
						</Suspense>
					</main>

					<Modal id="modal" />
					<Iframe />
				</ModalContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
