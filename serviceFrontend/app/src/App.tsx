import React, {useEffect, useState} from 'react';
import './App.css';
import Songs from "./admin/Songs";
import MainApp from "./app/MainApp";

import {BrowserRouter, Route, Routes} from "react-router-dom";
import SongsCreate from "./admin/SongsCreate";
import SongsEdit from "./admin/SongsEdit";
import PianoGame from "./app/game/PianoGame";

//flag for detecting useEffect() in development mode
let flag = true;

function App() {
    const [name, setName] = useState('');
    useEffect(() => {
        if (process.env.NODE_ENV === "development" && flag) {
            (
                async () => {
                    await fetch('/api/token_logged_in_user/', {
                        headers: {'Content-Type': 'application/json'},
                        credentials: 'include',
                    }).then(async response => {
                        const data = await response.json();
                        if (data.name) {
                            setName(data.name);
                        }
                    }).catch(e => {
                    })

                }
            )();
        }
        flag = !flag;
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainApp name={name} setName={setName}/>}/>
                    <Route path="/admin/songs/" element={<Songs/>}/>
                    <Route path="/admin/songs/create/" element={<SongsCreate/>}/>
                    <Route path="/admin/songs/:soundcloud_song_id/edit/" element={<SongsEdit/>}/>
                    <Route path="/game/piano/" element={<PianoGame name={name} setName={setName}/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
