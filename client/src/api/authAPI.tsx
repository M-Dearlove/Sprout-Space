import { User } from "../interfaces/User";



interface LoginResponse {
  token: string;
}
//user creating a login
const login = async (userInfo: User): Promise<LoginResponse | null> => {
  try {
      const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo), // send user credentials
    });
    
    if (!response.ok) {
      throw new Error('Login failed: Invalid credentials or server error');
    }
    
    //if login is successful, a new token will be sent in the response
    const data: LoginResponse = await response.json();
    console.log(`response from server, token:`, data)
    // Check if a token is present in the response
    if (data.token) {
      // Store token in localStorage
            localStorage.setItem('token', data.token);
      return data; // Return the login response containing the token
    } else {
      console.error('Token not found in the response');
      return null; // No token returned
    }
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export { login };
