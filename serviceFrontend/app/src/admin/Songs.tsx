import React, {useEffect, useState,} from 'react';
import {Song} from "../interfaces/song";
import {Link, useLocation} from "react-router-dom";
import UI from "./ui/UI";


//flag for detecting useEffect() in development mode
let flag = true;
const regexForSongId = 'tracks%2F(.*)&';
var SC = require('soundcloud');
SC.initialize({
    client_id: 'ZzQw5OLejAQys1cYAUI2nUbLtZbBe5Lg'
});
const Songs = () => {
        // rerender when call setSongs
        const [songs, setSongs] = useState([] as Song[]);
        //#new URLSearchParams(useLocation()['search']).get('keyword')
        const keyword = useLocation()['search'];
        const list = async () => {
            const response = await fetch('/api/songs/' + keyword);
            if (response.status !== 200) {
                window.confirm('Server error, try again later.')
                return
            }
            const songs = await response.json();

            const get = async (s: Song) => {
                if (!s['soundcloud_song_id']) {
                    try {
                        const html = await SC.oEmbed(s.url, {
                            //auto_play: true
                        });
                        s.soundcloud_song_id = (await html['html']).match(regexForSongId)[1];
                        await fetch('/api/songs/' + s.id, {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({'soundcloud_song_id': s.soundcloud_song_id})
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            };
            await Promise.all(songs.map(get))
            setSongs(songs);
        }

//UseEffect will be invoked after only the first rendering, or when the variable inside deps change, we have to use this, because list() will rerender and result in a list() 'recursion'
        useEffect(() => {
            //in development mode, it renders twice each time
            if (process.env.NODE_ENV === "development" && flag) {
                list();
            }
            flag = !flag;
        },[1]);

        const deleteSong = async (id: number) => {
            if (window.confirm('Delete this song?')) {
                await fetch(`/api/songs/${id}`, {
                    method: 'DELETE'
                }).then(async (response) => {
                    if (response.status === 204) {
                        setSongs(songs.filter((s: Song) => s.id !== id));
                    } else {
                        window.confirm('Server error, try again later.')
                    }
                });
            }
        }
        return (<UI>
                <div className="table100">
                    <div className="table100-head">
                        <table>
                            <thead className="admin-header">
                            <tr>
                                <th className="column1">ID</th>
                                <th className="column2">Song</th>
                                <th className="column3">Name</th>
                                <th className="column4">Artist</th>
                                <th className="column5">Album</th>
                                <th className="column6">Like</th>
                                <th className="column7">Action</th>
                                <th className="column8"></th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table100-body scrollbar-sunny-morning">
                        <table>
                            <tbody>
                            {songs.map(
                                (s: Song) => {
                                    return (
                                        <tr>
                                            <td className="column1">{s.id}</td>
                                            <td className="column2">
                                                <iframe title="SCBoard" frameBorder="no" height="95" width="100%"
                                                        src={"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + s.soundcloud_song_id + "&auto_play=false&show_artwork=false"}>
                                                </iframe>
                                            </td>
                                            <td className="column3">{s.song_name}</td>
                                            <td className="column4">{s.artist}</td>
                                            <td className="column5">{s.album}</td>
                                            <td className="column6">{s.likes}</td>
                                            <td className="column7">
                                                <div className="btn-group-vertical">
                                                    <Link to={`/admin/songs/${s.id}/edit`}
                                                          className="btn btn-1 btn-outline-secondary">Edit</Link>
                                                    <button className="btn btn-1 btn-outline-secondary"
                                                       onClick={() => deleteSong(s.id)}
                                                    >Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                    </div>
                </div>
            </UI>
        );
    }
;

export default Songs;
