import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';


import checkPw from './CheckPw';

function Login() {
   
   
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(null);

    const loginClick = (event) => {
        event.preventDefault(); 
        const status = checkPw(password);
        setLoginStatus(status.toLowerCase());
    };
    


    return (
        <div className="container">
            <form onSubmit={loginClick}>
            {loginStatus === null ? (
                <div className="login" >
                    <input 
                    type="text" 
                    placeholder="password" 
                    id="loginInput" 
                    defaultValue={""} 
                    onChange={e => setPassword(e.target.value)} 
                    />
                    <button type="submit">Login</button>
                    
                </div>
            ) : loginStatus === "frontdesk" ? (
                <div className='front desk'>
                    <div>You logged into front desk!</div>
                </div>
            ) : loginStatus === "security" ? (
                <div className='security'>
                    <div>You logged into security!</div>
                </div>
            ) : loginStatus === "racer" ? (
                <div className='racer'>
                    <div>You logged into racerPortal!</div>
                    <a href="/racer" class="active">Racer page</a>
           
                </div>
            ) : (
                <div className='invalid'>
                <   div>Enter valid password</div>
                </div>
            )}
            </form>
        </div>
    );
}

export default Login;