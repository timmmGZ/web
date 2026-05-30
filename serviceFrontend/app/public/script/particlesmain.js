particlesJS("particles-js", {
    "particles": {
        "number": {"value": 168, "density": {"enable": false, "value_area": 1000}},
        "color": {"value": "#ffff75"},
        "shape": {
            "type": "circle",
            "stroke": {"width": 0, "color": "#000000"},
            "polygon": {"nb_sides": 5},
            "image": {"src": "img/github.svg", "width": 100, "height": 100}
        },
        "opacity": {
            "value": 0.4,
            "random": false,
            "anim": {"enable": true, "speed": 0.6496617698410762, "opacity_min": 0, "sync": true}
        },
        "size": {"value": 3, "random": false, "anim": {"enable": true, "speed": 5, "size_min": 1, "sync": false}},
        "line_linked": {"enable": true, "distance": 130, "color": "#ffffca", "opacity": 0.5, "width": 1},
        "move": {
            "enable": true,
            "speed": 3,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {"enable": false, "rotateX": 320.6824121731046, "rotateY": 400.8530152163807}
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {"enable": true, "mode": "bubble"},
            "onclick": {"enable": true, "mode": "repulse"},
            "resize": true
        },
        "modes": {
            "grab": {"distance": 400, "line_linked": {"opacity": 1}},
            "bubble": {"distance": 168, "size": 25, "duration": 10, "opacity": 0.7714733516862778, "speed": 3},
            "repulse": {"distance": 138.05312609122865, "duration": 0.4},
            "push": {"particles_nb": 4},
            "remove": {"particles_nb": 2}
        }
    },
    "retina_detect": true
});
