import {MouseEvent, TransitionEvent} from "react";

export function onMouseEnterHandler(event: MouseEvent) {
    let card = event.nativeEvent.composedPath().find(e => {
        return (e as HTMLElement).className === "col d-flex"
    }) as HTMLElement;
    if (card === undefined) {
        card = (event.relatedTarget as HTMLElement).querySelector(".card") as HTMLElement
    } else {
        card = card.firstChild as HTMLElement
    }
    card.style.transition = "0.5s linear"
}

export function onMouseMoveCardHandler(event: MouseEvent) {
    const card = event.nativeEvent.composedPath().find(e => {
        return (e as HTMLElement).className === "card"
    }) as HTMLElement
    const e = event.nativeEvent;
    // const CardRectInit=window.getComputedStyle(card)
    const cardRectDynamic = event.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - cardRectDynamic.left;
    const offsetY = e.clientY - cardRectDynamic.top;
    const w = cardRectDynamic.width
    const h = cardRectDynamic.height
    const offsetCX = w / 2 - offsetX;
    const offsetCY = h / 1.5 - offsetY;
    if (card.className === "card") {
        card.style.transform = 'perspective(1000px) scale(1.2) rotateX(' + offsetCY / 10 + 'deg) rotateY(' + -(offsetCX / 10) + 'deg)'

        Array.from(card.children).forEach(child => {
            (child as HTMLElement).style.transform = 'scale(0.9) translateZ(50px)'
        });
    }
}

export function onMouseOutCardHandler(event: MouseEvent) {
    if ((event.target as HTMLElement).className === "card") {
    }
    const card = event.nativeEvent.composedPath().find(e => {
        return (e as HTMLElement).className === "card"
    }) as HTMLElement
    if (card) {
        card.style.transition = "0.55s"
        card.style.transform = 'rotateX(0deg) rotateY(0deg)'
        Array.from(card.children).forEach(child => {
            (child as HTMLElement).style.transform = 'translateZ(50px)'
        });
    }
}

export function onTransitionEndHandler(event: TransitionEvent) {
    const card = event.target as HTMLElement;
    if (card.className === "card" && card.style.transition.startsWith("all 0.")) {
        card.style.transition = "0.3s cubic-bezier(.4,.96,.74,.97)"
    }
}

