import React from 'react';
import {
    onMouseEnterHandler,
    onMouseMoveCardHandler,
    onMouseOutCardHandler,
    onTransitionEndHandler
} from "./CardEventHandler";
import {Song} from "../../interfaces/song";

const SongCard = (props: { s: Song, like: (id: number) => void }) => {

    const nameSize = (len: number) => {
        if (len > 30) {
            return "13px"
        } else if (len > 20) {
            return "15px"
        }
        return "18px"
    };
    let btn = <button
        className={"btn btn-2 " + (props.s.liked === true ? "btn-unlike" : "btn-like")}
        onClick={() => props.like(props.s.id)}>{props.s.liked === true ? "Unlike" : "like"}</button>
    return (

        <div className="col d-flex justify-content-center">
            <div className="card" onMouseMove={onMouseMoveCardHandler}
                 onMouseLeave={onMouseOutCardHandler}
                 onTransitionEnd={onTransitionEndHandler}
                 onMouseEnter={onMouseEnterHandler}>
                <div className="iframe">
                    <iframe title="SCBoard"
                            frameBorder="no" height="100%" width="100%"
                            src={"https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + props.s.soundcloud_song_id + "&amp;auto_play=false&amp;show_artwork=true&amp;visual=true&amp;origin=twitter"
                            }>
                    </iframe>
                </div>
                <div className="card-body">
                    <h6 className="card-text"
                        style={{fontSize: nameSize(props.s.song_name.length)}}>{props.s.song_name}</h6>
                    <div className="card-song">
                        <p className="card-text"><span>ARTIST: </span><a
                            href={"/?keyword=" + props.s.artist}>{props.s.artist}</a></p>
                        <p className="card-text"><span>ALBUM: </span>{props.s.album}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center"
                         style={{marginTop: "10px"}}>
                        {btn}
                        <small
                            className="text-muted btn-like">{props.s.likes + " likes"}</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongCard;