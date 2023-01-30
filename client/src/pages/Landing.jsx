function Landing() {
	return (
        <>
        <div className="w-3/4 m-auto">
            <h2 className="text-2xl w-56 m-auto mb-3 border-b-4 border-stone-300 text-center">
                Welcome to Setlist
            </h2>

            <p className="mb-4">Setlist is the new home for your playlists. Create an account to start making playlists, using a database of songs submitted by users like you.</p>
        </div>

        <div className="w-72 m-auto border-4 border-stone-300 text-center py-1">
            <a href="/login" className="text-lg">Log In</a>

            <p>or</p>

            <a href="/signup" className="text-lg">Sign Up</a>
        </div>
        </>
	);
};

export default Landing;