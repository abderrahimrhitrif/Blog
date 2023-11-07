import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    async function register(ev) {
        ev.preventDefault();
        const response = await fetch(`https://blog-api-seven-murex.vercel.app/register`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.status === 400){
            alert('Username already exists, please consider using a diffrent username');
        }
        else{
            alert('Registration successful');
        }


    }

    const isRegisterDisabled = !username || !password || password !== confirmPassword;

    return (
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                            <div className="card-body p-5 text-center">
                                <h2 className="mb-5 fw-bold">Register</h2>
                                <form onSubmit={register}>
                                    <div className="form-outline mb-4">
                                        <input
                                            type="text"
                                            id="typeUsernameX-2"
                                            className="form-control form-control-lg"
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />
                                        <label className="form-label" htmlFor="typeUsernameX-2">Username</label>
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
                                    <div className="form-outline mb-4">
                                        <input
                                            type="password"
                                            id="typeConfirmPasswordX-2"
                                            className="form-control form-control-lg"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                        />
                                        <label className="form-label" htmlFor="typeConfirmPasswordX-2">Confirm Password</label>
                                    </div>
                                    <button className="btn btn-primary btn-lg btn-block mb-4" type="submit" disabled={isRegisterDisabled}>Register</button>
                                </form>
                                <div className="form-check">Already have an account? <Link className="text-info" to="/login">Log in</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
