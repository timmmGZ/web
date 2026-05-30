particlesJS("particles-js", {
    "particles": {
        "number": {"value": 5, "density": {"enable": true, "value_area": 800}},
        "color": {"value": "#f0ff82"},
        "shape": {
            "type": "circle",
            "stroke": {"width": 0, "color": "#000"},
            "polygon": {"nb_sides": 5},
            "image": {"src": "img/github.svg", "width": 100, "height": 100}
        },
        "opacity": {
            "value": 0.3,
            "random": true,
            "anim": {"enable": false, "speed": 1, "opacity_min": 0.1, "sync": false}
        },
        "size": {"value": 160, "random": false, "anim": {"enable": true, "speed": 10, "size_min": 40, "sync": false}},
        "line_linked": {"enable": false, "distance": 200, "color": "#ffffff", "opacity": 1, "width": 2},
        "move": {
            "enable": true,
            "speed": 8,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {"enable": false, "rotateX": 600, "rotateY": 1200}
        }
    },

    "retina_detect": true
});