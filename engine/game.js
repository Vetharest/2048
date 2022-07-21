/*
Add your code for Game here
 */

class Game {

    constructor(length) {
        this.length = (length < 1) ? 1 : length;
        this.moveObservers = []; 
        this.winObservers = [];
        this.loseObservers = [];
        this.setupNewGame();

        this.won = false;
        this.over = false;

        this.gameState = this.getGameState();
    }

    loadGame(gameState) {
        this.gameboard = gameState.board;
        this.score = gameState.score;
        this.won = gameState.won;
        this.over = gameState.over;
    }

    toString() {
        let returnString = "";
        for (let row = 0; row < this.length; row++) {
            returnString += " ";
            for(let col = 0; col < this.length ; col++) {
                returnString = returnString + "[" + this.gameboard[row * this.length + col] + "] ";
            }
            returnString += "\n";
        }
        return returnString;
    }

    getGameState() {
        this.gameState = { 
            board: this.gameboard,
            score: this.score,
            won: this.won,
            over: this.over,
        }
        return this.gameState;
    }

    setupNewGame() {
        this.score = 0;
        this.won = false;
        this.over = false;
        this.gameboard = [];
        for (let row = 0; row < this.length ; row++) {
            for (let col = 0 ; col < this.length ; col++) {
                this.gameboard.push(0);
            }
        }
        this.addRandomTile();
        this.addRandomTile();
        this.updateMove();
    };

    onMove(listener) {
        this.moveObservers.push(listener);
    }

    onWin(listener) {
        this.winObservers.push(listener);
    }

    onLose(listener) {
        this.loseObservers.push(listener);
    }

    updateMove() {
        if(this.check_for_defeat()) {
            this.loseTrigger();
        }
        if(!this.won && this.check_for_victory()) {
            this.winTrigger();
        }
        this.moveObservers.forEach(listener => {listener(this.getGameState())});
    }

    winTrigger() {
        this.won = true;
        this.winObservers.forEach(listener => {listener(this.getGameState())});
    }

    loseTrigger() {
        this.over = true;
        this.loseObservers.forEach(listener => {listener(this.getGameState())});
    }

    countEmptyTiles() {
        let numEmpty = 0;
        this.gameboard.forEach(tile => numEmpty += (tile == 0) ? 1 : 0);
        return numEmpty;
    }

    addRandomTile() {
        let chance = this.countEmptyTiles();
        /* This method determines a random tile to insert a number in by sequentially 
        * increasing the probability for a tile to be picked as the algorithm looks
        * through more tiles prior. 
        * 
        * For example, on a clear board, the first tile has probability 1/16 of being 
        * picked, the second tile has probability 15/16 * 1/15 = 1/16 of being picked,
        * and so on.
        */
        for (let tile = 0; tile < this.gameboard.length ; tile++) {
            if (this.gameboard[tile] == 0) {
                if (Math.random() <= 1/chance) {
                    if(Math.random() <= 0.9) {
                        this.gameboard[tile] = 2;
                    } else {
                        this.gameboard[tile] = 4;
                    }
                    return;
                }
                chance--;
            } 
        }
    }

    move(direction) {
        if (this.over) {
            return;
        }
        let augmentedBoard = [];
        switch(direction) {
            case "up":
                for (let i = 0; i < this.length; i++) {
                    let augmentedRow = [];
                    for (let j = 0; j < this.length ; j++) {
                        augmentedRow.push(this.gameboard[this.length * j + i]);
                    }
                    augmentedBoard.push(augmentedRow);
                }
                break;
            case "down":
                for (let i = 0; i < this.length ; i++) {
                    let augmentedRow = [];
                    for (let j = this.length - 1; j >= 0 ; j--) {
                        augmentedRow.push(this.gameboard[this.length * j + i]);
                    }
                    augmentedBoard.push(augmentedRow);
                }
                break;
            case "left":
                for (let i = 0; i < this.length; i++) {
                    let augmentedRow = [];
                    for (let j = 0; j < this.length ; j++) {
                        augmentedRow.push(this.gameboard[this.length * i + j]);
                    }
                    augmentedBoard.push(augmentedRow);
                }
                break;
            case "right":
                for (let i = 0; i < this.length; i++) {
                    let augmentedRow = [];
                    for (let j = this.length - 1; j >= 0 ; j--) {
                        augmentedRow.push(this.gameboard[this.length * i + j]);
                    }
                    augmentedBoard.push(augmentedRow);
                }
                break;
            default: return;
        }

        let legalMove = false;
        for (let i = 0 ; i < this.length ; i++) {
            legalMove = this.shiftRow(augmentedBoard[i]) || legalMove;
        }
        
        switch(direction) {
            case "up":
                for (let i = 0; i < this.length; i++) {
                    for (let j = 0; j < this.length ; j++) {
                        this.gameboard[4 * j + i] = augmentedBoard[i][j];
                    }
                }
            break;
            case "down":
                for (let i = 0; i < this.length; i++) {
                    for (let j = 0; j < this.length; j++) {
                        this.gameboard[4 * (this.length - 1 - j) + i] = augmentedBoard[i][j];
                    }
                }
            break;
            case "left":
                for (let i = 0; i < this.length; i++) {
                    for (let j = 0; j < this.length ; j++) {
                        this.gameboard[4 * i + j] = augmentedBoard[i][j];
                    }
                }
            break;
            case "right":
                for (let i = 0; i < this.length; i++) {
                    for (let j = 0; j < this.length ; j++) {
                        this.gameboard[4 * i + (this.length - 1 - j)] = augmentedBoard[i][j];
                    }
                }
            break;
            default: return;
        }
        if (legalMove) {
            this.addRandomTile();
            this.updateMove();
        }
    }

    shiftRow (augmentedRow) {
        /* This helper function takes in an augmented row from Game.move and
        shifts to the left one time, without conserving the array, via the rules of 2048. 
        Also returns whether the move changes anything in this row. */
        let tracker = 0;
        let legalMove = false;
        for (let tile = 1 ; tile < augmentedRow.length ; tile++) {
            if (augmentedRow[tile] == 0) { // Case: Nothing to do
                continue;
            }
            if (augmentedRow[tile] === augmentedRow[tracker]) { // Case: Fusing of tiles
                augmentedRow[tracker] = 2 * augmentedRow[tracker];
                this.score += augmentedRow[tracker];
                augmentedRow[tile] = 0;
                legalMove = true;
                tracker++;
            } else if (augmentedRow[tracker] == 0) { // Case: Shift left into empty
                augmentedRow[tracker] = augmentedRow[tile];
                augmentedRow[tile] = 0;
                legalMove = true;
            } else { // Case: Two incompatible tiles clash
                let designatedValue = augmentedRow[tile];
                augmentedRow[tile] = 0;
                augmentedRow[tracker + 1] = designatedValue;
                if (tile != tracker + 1) { // No tiles shift when the tracker and tile are adjacent and unequal
                    legalMove = true;
                }
                tracker++;
            }
        }
        return legalMove;
    }

    check_for_defeat() { // Controller function moved to model to ensure run_in_console works
        let gameOver = true;
        for (let row = 0 ; row < this.length - 1 ; row++) { // check all spaces below
            for (let col = 0 ; col < this.length ; col ++) {
                let checkedValue = this.gameboard[row * this.length + col];
                let valueBelow = this.gameboard[(row + 1) * this.length + col];
                if (checkedValue == 0 || valueBelow == 0 || checkedValue == valueBelow) {
                    gameOver = false;
                }
            }
        }
        for (let row = 0 ; row < this.length ; row++) { // check all spaces to the right
            for (let col = 0 ; col < this.length - 1 ; col ++) {
                let checkedValue = this.gameboard[row * this.length + col];
                let valueRight = this.gameboard[row * this.length + col + 1];
                if (checkedValue == 0 || valueRight == 0 || checkedValue == valueRight) {
                    gameOver = false;
                }
            }
        }
        return gameOver;
    }

    check_for_victory() { // Controller function moved to model to ensure run_in_console works
        return this.gameboard.includes(2048);
    }

}
export default Game;