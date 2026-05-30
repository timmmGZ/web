import React, {useState} from 'react';
import Navigator from "../ui/Navigator";
import Background from "../ui/Background";

const PianoGame = (props: { name: string, setName: (name: string) => void }) => {
    const [authBoard, setAuthBoard] = useState(<div/>);
    return (
        <div className="animated-background">
            <Navigator name={props.name} setName={props.setName} setAuthBoard={setAuthBoard}/>
            <Background backgroundType="game">
                {authBoard}
                <div className="album-wrapper">
                    <div className="game scrollbar-sunny-morning">
                        <iframe title="piano" scrolling="no" id="game-frame" src="/game/index.html"
                                ref={input => input && input.focus()}></iframe>
                    </div>
                </div>
            </Background>
        </div>
    );
};

export default PianoGame;