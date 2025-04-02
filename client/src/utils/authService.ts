//client/src/utils.auth.ts
import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    // return the decoded token
    const token = this.getToken();
    if (token) {
      return jwtDecode<JwtPayload>(token); // Decode the token and return the payload
    }
    return null; // If no token, return null
  }

  decodeToken(token: string | null) {
    if (!token) return null;
    try {
      const decoded =  jwtDecode<{ id: number }>(token); // Ensure userId is present
      console.log('Decoded in AuthService', decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  loggedIn() {
    //return a value that indicates if the user is logged in
    const token = this.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        //log user out if token expires
        this.logout();  //log the user out 
        return false; //return false to indicate the user is no longer logged in
      }
      return true; //if token is not expired will return true
    }
    return false; //if no token
  }
  
  isTokenExpired(token: string) {
    // TODO: return a value that indicates if the token is expired
    try {
      const decoded: JwtPayload = jwtDecode(token);
      //if decoded.exp undefined return expired
      if (!decoded.exp) {
        return true;
      }
       const expirationTime = decoded.exp * 1000; // Convert expiration time to milliseconds
      //Date now milisecons since JAn 1, 1970 (Unix timestamp)
      const expired = Date.now() > expirationTime; // Return true if the token is expired
        return expired;
    } catch (error) {
        return true; // If decoding fails, treat the token as expired
    }
  }

  getToken(): string {
    // return the token
    const storedToken =  localStorage.getItem('token') || '';
    return storedToken;
    }

  login(idToken: string) {
    //  set the token to localStorage
    localStorage.setItem('token', idToken); // Store token in localStorage
    
    //  redirect to the home page
    window.location.href = '/'; // Redirect to the home page 
  }

  logout() {
    // to log someone out remove the token from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (emailInput && passwordInput) {
      emailInput.value = '';  // Clear email field
      passwordInput.value = '';  // Clear password field
    }
    //redirect to the login page
    window.location.href = '/'; // Redirect to main page
  }
}

export default new AuthService();
