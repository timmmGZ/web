import React, {PropsWithChildren, useEffect} from 'react';

const Background = (props: PropsWithChildren<any>) => {
        const jsMap = {"game": "particlesgame.js", "main": "particlesmain.js"}
        useEffect(() => {
            const type = props["backgroundType"] as keyof typeof jsMap;
            const file = jsMap[type];
            const script = document.createElement('script');
            script.src = 'https://vincentgarreau.com/particles.js/assets/_build/js/lib/particles.js';
            script.async = false;
            document.body.appendChild(script);
            const script2 = document.createElement('script');
            script2.src = '/script/' + file;
            script2.async = false;
            document.body.appendChild(script2);
            return () => {
                document.body.removeChild(script);
                document.body.removeChild(script2);
            };
        }, [])

        return (
            <div id="particles-js" className="scrollbar-sunny-morning">
                {props.children}
            </div>
        );
    }
;

export default Background;