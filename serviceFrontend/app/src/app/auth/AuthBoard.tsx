import React, {useEffect} from 'react';
import Register from "./Register";
import Login from "./Login";

const AuthBoard = (props: {
        name: string, setName: (name: string) => void, setAuthBoard: (authBoard: JSX.Element) => void, setRedirect: (redirect: boolean) => void
    }) => {
        useEffect(() => {
            const script = document.createElement('script');
            script.src = '/script/auth.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }, [])

        return (
            <div className="auth-board">
                <div className="auth-shell">
                    <div className="auth-top">
                        <span className="auth-off">SIGN IN</span>
                        <div className="auth-button">
                            <span className="auth-ball"></span>
                        </div>
                        <span className="auth-on">SIGN UP</span>
                    </div>
                    <div className="auth-bottom">
                        <Login name={props.name} setName={props.setName} setAuthBoard={props.setAuthBoard}
                               setRedirect={props.setRedirect}/>
                        <Register setAuthBoard={props.setAuthBoard}/>
                    </div>
                </div>
            </div>
        );
    }
;

export default AuthBoard;