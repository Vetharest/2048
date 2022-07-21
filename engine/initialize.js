import Game from './game.js'
import Controller2048 from './controller.js'

window.addEventListener('load', () => {
    let newgame = new Game(4);
    let view = new View2048(newgame);
    let controller = new Controller2048(newgame, view);

    let body = document.querySelector('body');
    body.append(view.page);
})