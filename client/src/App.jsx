import { Suspense, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./UserContext.jsx";
import ModalContext from "./ModalContext.jsx";

import Router from "./Router.jsx";
import Loading from "./Loading.jsx";

import Header from "./components/layout/Header.jsx";
import Modal from "./components/layout/Modal";

function App() {
	const [user, setUser] = useState(null);
	const [modal, setModal] = useState({
		active: "",
		msg: "",
		navTo: ""
	});

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
				</ModalContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
