async function useFetch(url, method, body, token) {
	const response = await fetch(url, {
		method: method ? method : "GET", // just in case i forget
		body: body ? JSON.stringify(body) : null,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: token ? "Bearer " + token : null
		}
	});

	const json = await response.json();

	if (!response.ok) {
		const { message } = json;

		throw Error(message);
	}

	return json;
}

export default useFetch;
