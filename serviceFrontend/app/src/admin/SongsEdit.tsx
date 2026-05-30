import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import UI from "./ui/UI";
import {Song} from "../interfaces/song";

const SongsEdit = () => {
    // have to use useState(), then will rerender after submit() to navigate to Songs
    const [redirect, setRedirect] = useState(false);
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    var id = useParams()['soundcloud_song_id'];
    useEffect(() => {
        const getSong = async () => {
            await fetch('/api/songs/' + id).then(response =>
                response.json()).then((song: Song) => {
                setUrl(song.url);
                setName(song.song_name);
                setArtist(song.artist);
                setAlbum(song.album);
            }).catch((e) => {
                window.confirm('Server error, try again later.')
            });
        }
        getSong();
    }, [id]);
    if (redirect)
        return <Navigate to={'/admin/songs'}/>
    const submit = async (e: SyntheticEvent) => {
        //preventDefault() prevents refresh after onSubmit, else it will go back to this page after redirection
        e.preventDefault();
        await fetch('/api/songs/' + id, {
            method: 'PUT',
            //prevent response 415 (Unsupported Media Type)
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'url': url, 'artist': artist, 'song_name': name, 'album': album})
        }).then(async (response) => {
            if (response.status === 202) {
                setRedirect(true);
            } else if (response.status === 400) {
                window.confirm('Incorrect inputs.')
            } else {
                window.confirm('Server error, try again later.')
            }
        }).catch((e) => {
            window.confirm('Server error, try again later.')
        });
    }
    return (
        <UI>
            <form className="form-group container-fluid" onSubmit={submit}>
                <div className="form-group">
                    <label>Url</label>
                    <input type="text" className="form-control" name="url" value={url}
                           onChange={e => setUrl(e.target.value)}/>
                    <label>Name</label>
                    <input type="text" className="form-control" name="title" value={name}
                           onChange={e => setName(e.target.value)}/>
                    <label>Image</label>
                    <input type="text" className="form-control" name="image" value={album}
                           onChange={e => setAlbum(e.target.value)}/>
                    <label>Artist</label>
                    <input type="text" className="form-control" name="album" value={artist}
                           onChange={e => setArtist(e.target.value)}/>
                </div>
                <button className="btn btn-outline-secondary">Save</button>
            </form>
        </UI>);
};

export default SongsEdit;