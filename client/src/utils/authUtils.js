import decode from 'jwt-decode';

class AuthService {
    // get token from localStorage
    getToken() {
        return localStorage.getItem("setlist_token");
    }

    // add token to localStorage (login)
    createToken(token) {
        localStorage.setItem("setlist_token", token);
        window.location.assign('/');
    }

    // remove token from localStorage (logout)
    deleteToken() {
        localStorage.removeItem("setlist_token");
        window.location.assign('/');
    }

    // get user data from token
    // will return username and _id
    decodeToken() {
        return decode(this.getToken());
    }

    // check if token is expired
    isTokenExpired(token) {
        try {
            const tokenData = this.decodeToken();
            const isExpired = tokenData.exp < Date.now() / 1000;

            return isExpired;
        } catch {
            return false;
        }
    }

    // check if token exists and is not expired
    isTokenValid(token) {
        const token = this.getToken();
        const isExpired = isTokenExpired(token);
        
        if (isExpired || !token) {
            return false;
        }

        return true;
    }
}

export default new AuthService();