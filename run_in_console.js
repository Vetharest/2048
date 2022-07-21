import keypress from 'keypress';
import Game from "./engine/game.js";

keypress(process.stdin);


/**
 * The code in this file is used to run your game in the console. Use it
 * to help develop your game engine.
 *
 */

let game = new Game(4);
let sampleGame = {
    board: [
        2, 2, 32, 1024, 
        0, 4, 8, 512, 
        0, 0, 0, 4,
        0, 0, 0, 2
      ],
    score: 80,
    won: false,
    over: false    
}
game.loadGame(sampleGame);
console.log(game.toString());

game.onMove(gameState => {
    console.log(game.toString());
    console.log(game.gameState);
});

game.onWin(gameState => {
    console.log('You won with a gameState of...', gameState)
});

game.onLose(gameState => {
    console.log('You lost! :(', gameState)
    console.log(`Your score was ${gameState.score}`);
});

process.stdin.on('keypress', function (ch, key) {
    switch (key.name) {
        case 'right':
            game.move('right');
            break;
        case 'left':
            game.move('left');

            break;
        case 'down':
            game.move('down');

            break;
        case 'up':
            game.move('up');
            break;
    }
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
});


process.stdin.setRawMode(true);
process.stdin.resume();

