import React, {useEffect, useState} from 'react';

import {Song} from "../interfaces/song";
import {useLocation} from "react-router-dom";
import Navigator from "./ui/Navigator";
import SongCard from "./song/SongCard";
import {like} from "./song/SongUserFunctionality"
import Background from "./ui/Background";

const regexForSongId = 'tracks%2F(.*)&';
const SC = require('soundcloud');
SC.initialize({
    client_id: 'ZzQw5OLejAQys1cYAUI2nUbLtZbBe5Lg'
});
let flag = true;

const MainApp = (props: { name: string, setName: (name: string) => void }) => {
    const [authBoard, setAuthBoard] = useState(<div/>);
    const [songs, setSongs] = useState([] as Song[]);
    //#new URLSearchParams(useLocation()['search']).get('keyword')
    const keyword = useLocation()['search'];


//UseEffect will be invoked after only the first rendering, or when the variable inside deps change, we have to use this, because list() will rerender and result in a list() 'recursion'
    useEffect(() => {
        //in development mode, it renders twice each time
        if (process.env.NODE_ENV === "development" && flag) {
            const list = async () => {
                const response = await fetch('/api/main_app_songs_userlikes/' + keyword);
                if (response.status !== 200) {
                    window.confirm('Server error, try again later.')
                    return
                }
                const userLikeAndSongs = await response.json()
                const userLikes = userLikeAndSongs['userLikes']
                const songs = userLikeAndSongs['songs'];
                const setUserLikeAndSCSongID = async (s: Song) => {
                    if (userLikes) {
                        const ind = userLikes.indexOf(s.id)
                        if (ind !== -1) {
                            s['liked'] = true
                            userLikes.splice(ind, 1)
                        } else {
                            s['liked'] = false
                        }
                    }
                    if (!s['soundcloud_song_id']) {
                        try {
                            const html = await SC.oEmbed(s.url, {
                                //auto_play: true
                            });
                            s.soundcloud_song_id = (await html['html']).match(regexForSongId)[1];
                            fetch('/api/songs/' + s.id, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({'soundcloud_song_id': s.soundcloud_song_id})
                            })
                        } catch (e) {
                            s.url = "Nan"
                        }
                    }
                };
                await Promise.all(songs.map(setUserLikeAndSCSongID))
                setSongs(songs.filter((s: Song) => s.url !== "Nan"));
            }
            list();
        }
        flag = !flag;
    }, [keyword]);


    // const getUserLikes = async () => {
    //     const response = await fetch('/api/user_likes/', {
    //         method: 'GET', headers: {'Content-Type': 'application/json'},
    //     });
    //     let result = await response.json()
    //     if (response.status === 200) {
    //         return result
    //     }
    // }
    return (
        <main className="animated-background">
            <Navigator name={props.name} setName={props.setName} setAuthBoard={setAuthBoard}/>
            <Background backgroundType="main">
                {authBoard}
                <div className="album-wrapper">
                    <div className="album py-5">
                        <div className="container">
                            <div
                                className="row row-eq-height row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 row justify-content-center">
                                {songs.map(
                                    (s: Song) => {
                                        return <SongCard s={s} like={like(songs, setSongs)}/>
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </Background>

        </main>
    );
};

export default MainApp;
