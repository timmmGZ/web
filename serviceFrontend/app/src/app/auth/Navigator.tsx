import React, {KeyboardEvent, useState} from 'react';
import AuthBoard from "./AuthBoard";

const Navigator = (props: { name: string, setName: (name: string) => void, setAuthBoard: (authBoard: JSX.Element) => void }) => {
    const [keyword, setKeyword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const submit = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            document.getElementById('search')!.click();
        }
    }
    let logoutDisable = false;
    const logout = async () => {
        if (!logoutDisable && window.confirm('Logout?')) {
            logoutDisable = true;
            await fetch('/api/logout/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            }).catch(e => {
                logoutDisable = false;
                window.confirm('Server error, try again later.')
            })
            setRedirect(true);
        }
    }
    let menu;
    if (props.name === '') {
        menu = (
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                    <button className="nav-link"
                            onClick={e => props.setAuthBoard(<AuthBoard name={props.name} setName={props.setName}
                                                                        setAuthBoard={props.setAuthBoard}
                                                                        setRedirect={setRedirect}/>)}>Login
                    </button>
                </li>
            </ul>
        )
    } else {
        menu = (
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="main-nav">Hi {props.name},
                </li>
                <li>
                    <button className="nav-link main -nav logout" onClick={logout}>Logout</button>
                </li>
            </ul>
        )
    }

    if (redirect) {
        window.location.reload();
    }

    return (
        <nav className="navbar navbar-expand-md navbar-expand-sm navbar-expand-xs navbar-dark bg-dark">
            <div className="container-fluid">
                <a href="/" className="navbar-brand main-brand">Home</a>
                <a href="/game/piano/" className="navbar-brand main-brand">Game</a>
                <input className="form-control form-control-dark w-100 rounded-0 border-0" type="text"
                       placeholder="Search" aria-label="Search" onChange={e => {
                    setKeyword(e.target.value);
                }} onKeyUp={submit}/>
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap">
                        <a id="search" className="nav-link button-search px-3"
                           href={"/?keyword=" + keyword}>Search</a>
                    </div>
                </div>
                <div>
                    {menu}
                </div>
            </div>
        </nav>
    );
};

export default Navigator;
