if (typeof button === 'undefined') {
    let button = document.querySelector('.auth-button')
    let ball = document.querySelector('.auth-ball')
    let bottom = document.querySelector('.auth-bottom')
    let off = document.querySelector('.auth-off')
    let on = document.querySelector('.auth-on')
    let index = 0
    button.addEventListener('click', () => {
        if (index == 0) {
            index = 1
            ball.style.left = 61 + '%'
            on.style.opacity = 1
            off.style.opacity = 0.3
            bottom.style.transform = 'rotateY(180deg) translateZ(100px) '

        } else {
            index = 0
            ball.style.left = 0 + '%'
            on.style.opacity = 0.3
            off.style.opacity = 1
            bottom.style.transform = 'rotateY(0) translateZ(-100px) '

        }
    })
}