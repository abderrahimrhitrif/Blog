import React, { useContext, useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import './Login.css';
import { UserContext } from "../UserContext";

function Login() {
    const [username, setUsername] = useState(''); // Updated state variable and setter
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState('');
    const [loginError, setLoginError] = useState('');
    const {userInfo, setUserInfo} = useContext(UserContext);

    const handleUsernameChange = (event) => { // Updated state handler function
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const isLoginDisabled = !username || !password; // Updated variable name

    const handleLogin = async (ev) => {
        ev.preventDefault();
        try {
            const response = await fetch(`${process.env.API_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }), // Updated variable name
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response data
                setUserInfo(data); // Set user information
                setRedirect(true); // Redirect after successful login
                console.log('Login successful');
                console.log(data);
                console.log(userInfo);
                
                console.log('Login successful');
            } else {
                // Failed login
                setLoginError('Invalid username or password'); // Updated error message
            }
            
        } catch (error) {
            console.error('An error occurred during login:', error);
            setLoginError('An error occurred. Please try again later.');
        }
    };
    if(redirect){
        return <Navigate to={'/'} />
    }
    return (
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                            <div className="card-body p-5 text-center">
                                <h2 className="mb-5 fw-bold">Sign in</h2>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="typeUsernameX-2" // Updated input field ID
                                        className="form-control form-control-lg"
                                        value={username}
                                        onChange={handleUsernameChange} // Updated event handler
                                    />
                                    <label className="form-label" htmlFor="typeUsernameX-2">Username</label> {/* Updated label */}
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        type="password"
                                        id="typePasswordX-2"
                                        className="form-control form-control-lg"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                                </div>
                                
                                <button
                                    className="btn btn-primary btn-lg btn-block mb-4"
                                    type="button"
                                    disabled={isLoginDisabled}
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                                {loginError && <div className="text-danger">{loginError}</div>}
                                <div className="form-check">Don't have an account? <Link className="text-info" to='/register'>Sign up</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;

