import { useState } from "react";

import { useModalContext, useFetch } from "../hooks";

function ReachOut() {
	const [formState, setFormState] = useState({
		name: "",
		address: "",
		subject: "",
		body: ""
	});

	const { modal, setModal } = useModalContext();

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value
		});
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		// validate data
		if (!formState.name || !formState.address || !formState.subject || !formState.body) {
			setModal({
				...modal,
				active: "modal",
				msg: "All four email fields are required!"
			});

			return;
		}

		try {
			await useFetch("/api/email", "POST", formState); // no token

			setModal({
				...modal,
				active: "modal",
				msg: "Your email was sent! I'll get back to you as soon as I can."
			});
		} catch (err) {
			setModal({
				...modal,
				active: "modal",
				msg: `${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}

	return (
		<>
			<div className="page-title">
				<h2>Contact and Support</h2>
			</div>

			<div className="flex flex-row flex-wrap">
				<section className="flex-auto basis-64 mr-2.5">
					<h3 className="text-xl border-l-4 border-stone-400 mb-2.5 pl-4">
						<i className="fa-solid fa-record-vinyl mr-1.5"></i>
						Contact Me
					</h3>

					<p>
						Did you find a bug? Do you have a great idea for the future of the website?
						Is there a quirk of the UI that's making it hard to use? You can reach out
						to me at{" "}
						<a
							className="text-amber-700 underline"
							href="mailto:fpsetlistdev@gmail.com"
						>
							fpsetlistdev@gmail.com
						</a>
						. Alternatively, you can fill out the form below, and it'll get to me.
					</p>

					<p className="mb-2">
						If you have a bug report, please give a <em>detailed description</em> of the
						issue and when it happened, so it's easy for me to diagnose!
					</p>

					<form
						className="w-fit p-1.5 border-2 border-stone-300 rounded"
						onSubmit={onSubmitHandler}
					>
						<label htmlFor="name" className="block mb-0.5">
							Your name
							<span className="required" title="Required">
								*
							</span>
						</label>
						<input
							id="name"
							name="name"
							className="form-control"
							onChange={onChangeHandler}
						/>

						<label htmlFor="address" className="block mb-0.5">
							Your email address
							<span className="required" title="Required">
								*
							</span>
						</label>
						<input
							id="address"
							name="address"
							type="email"
							className="form-control"
							onChange={onChangeHandler}
						/>

						<label htmlFor="subject" className="block mb-0.5">
							Subject
							<span className="required" title="Required">
								*
							</span>
						</label>
						<input
							id="subject"
							name="subject"
							className="form-control"
							onChange={onChangeHandler}
						/>

						<label htmlFor="body" className="block mb-0.5">
							Body
							<span className="required" title="Required">
								*
							</span>
						</label>
						<textarea
							id="body"
							name="body"
							className="form-control"
							rows="4"
							onChange={onChangeHandler}
						></textarea>

						<button type="submit" className="rectangle-btn mt-2">
							Submit
						</button>
					</form>
				</section>

				<div className="flex-auto basis-64">
					<section className="mb-2.5">
						<h3 className="text-xl border-l-4 border-stone-400 mb-2.5 pl-4">
							<i className="fa-solid fa-record-vinyl mr-1.5"></i>
							Find Us on Github
						</h3>

						<p>
							You can also file bug reports on Setlist's{" "}
							<a
								className="text-amber-700 underline"
								href="https://github.com/FinnStitcher/setlist-react/issues"
							>
								Github Issues
							</a>{" "}
							page. This is also where to go if you want to see a little bit of what's
							planned for the future.
						</p>
					</section>

					<section>
						<h3 className="text-xl border-l-4 border-stone-400 mb-2.5 pl-4">
							<i className="fa-solid fa-record-vinyl mr-1.5"></i>
							Donate
						</h3>

						<p>
							Setlist is run by a single developer. If you like what I do here,
							consider{" "}
							<a
								className="text-amber-700 underline"
								href="https://ko-fi.com/finnphillips"
							>
								tipping me on Ko-Fi
							</a>{" "}
							to pay for the cost of hosting.
						</p>
					</section>
				</div>
			</div>
		</>
	);
}

export default ReachOut;
