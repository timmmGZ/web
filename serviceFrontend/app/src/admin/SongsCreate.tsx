import React, {SyntheticEvent, useState} from 'react';
import {Navigate} from 'react-router-dom';
import UI from "./ui/UI";

const SongsCreate = () => {
    // have to use useState(), then will rerender after submit() to navigate to Songs
    const [redirect, setRedirect] = useState(false);
    if (redirect)
        return <Navigate to={'/admin/songs'}/>

    var url = '';
    var name = '';
    var artist = '';
    var album = '';
    let submitDisable = false;

    const submit = async (e: SyntheticEvent) => {
        //e.preventDefault() prevents refresh after onSubmit, else it will go back to this page after redirection
        e.preventDefault()
        if (!submitDisable) {
            submitDisable = true;
            await fetch('/api/songs/', {
                method: 'POST',
                //prevent response 415 (Unsupported Media Type)
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'url': url, 'artist': artist, 'song_name': name, 'album': album})
            }).then(async (response) => {
                if (response.status === 201) {
                    setRedirect(true);
                } else {
                    submitDisable = false;
                    window.confirm('Incorrect inputs.')
                }
            }).catch((e) => {
                submitDisable = false;
                window.confirm('Server error, try again later.')
            });
        }
    }
    return (
        <UI>
            <form className="form-group container-fluid" onSubmit={submit}>
                <div className="form-group">
                    <label>Url</label>
                    <input type="text" className="form-control" name="url"
                           onChange={e => url = e.target.value}/>
                    <label>Name</label>
                    <input type="text" className="form-control" name="album"
                           onChange={e => name = e.target.value}/>
                    <label>Artist</label>
                    <input type="text" className="form-control" name="album"
                           onChange={e => artist = e.target.value}/>
                    <label>Album</label>
                    <input type="text" className="form-control" name="album"
                           onChange={e => album = e.target.value}/>
                </div>
                <button className="btn btn-outline-secondary">Save</button>
            </form>
        </UI>);
};

export default SongsCreate;
