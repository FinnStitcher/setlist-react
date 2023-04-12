import decode from 'jwt-decode';

class AuthService {
    // get token from localStorage
    getToken() {
        return localStorage.getItem("setlist_token");
    }

    // add token to localStorage (login)
    storeToken(token) {
        localStorage.setItem("setlist_token", token);
    }

    // remove token from localStorage (logout)
    deleteToken() {
        localStorage.removeItem("setlist_token");
    }

    // get user data from token
    // will return username and _id
    decodeToken(token) {
        return decode(token);
    }

    // check if token is expired
    isTokenExpired(token) {
        try {
            const tokenData = this.decodeToken(token);
            // returns true if we are past the expiration time
            const isExpired = tokenData.exp < Date.now() / 1000;

            return isExpired;
        } catch {
            return true;
        }
    }

    // check if token exists and is not expired
    isTokenValid(token) {
        const isExpired = this.isTokenExpired(token);
        
        if (isExpired || !token) {
            return false;
        }

        return true;
    }
}

export default new AuthService();