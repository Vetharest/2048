let View2048 = class {
    constructor(model) {
        this.model = model;
        this.listeners = [];

        this.page = document.createElement('div');
        this.page.setAttribute('id', 'centered');

        let heading = document.createElement('header');

        let title = document.createElement('div')
        title.setAttribute('id', 'gameName');
        title.innerHTML = "<h2>2048</h2>";
        heading.append(title);

        let scoreScreen = document.createElement('div');
        scoreScreen.setAttribute('id', 'scoreScreen');
        model.onMove((gamestate) => {
            scoreScreen.innerHTML = `Score: &nbsp<strong>${gamestate.score}</strong>`;
        });

        heading.append(scoreScreen);
        this.page.append(heading);

        let mainBody = document.createElement('table');
        for (let i = 0; i < model.length ; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < model.length ; j++) {
                let tile = document.createElement('td');
                row.append(tile);
                {
                    let thisRow = i;
                    let thisColumn = j;

                    model.onMove( (gamestate) => {
                        let thisValue = gamestate.board[thisRow * model.length + thisColumn];
                        tile.removeAttribute("class");
                        tile.classList.add('tile');
                        tile.classList.add(`t${thisValue}`);
                        if (thisValue != 0) {tile.innerHTML = `<span>${thisValue}</span>`;}
                        else {tile.innerHTML = ''};
                    });
                }
            }
            mainBody.append(row);
        }
        model.onWin( (gamestate) => {
            let winCard = document.createElement('div');
            winCard.setAttribute('id', 'victoryScreen');
            winCard.setAttribute('float', 'center');

            let continueDiv = document.createElement('div');
            continueDiv.setAttribute('id', 'continueDiv');
            continueDiv.innerHTML = `<h1>You Win!</h1>`;

            let continueButton = document.createElement('button');
            continueButton.onclick = () => {winCard.remove()};
            continueButton.setAttribute('float', 'center');
            continueButton.innerHTML = 'Continue?';

            continueDiv.append(continueButton);
            winCard.append(continueDiv);
            
            mainBody.append(winCard);
        });
        this.page.append(mainBody);

        let consolationMessage = document.createElement('p');
        model.onLose( (gamestate) => {
            consolationMessage.innerHTML = "Oh, well. Your score was " + gamestate.score + ". Want to try again?";
            heading.append(consolationMessage);
        });

        let resetButton = document.createElement('button');
        resetButton.setAttribute('id', 'resetButton');
        resetButton.innerHTML = "New Game";
        resetButton.addEventListener('click', () => {this.model.setupNewGame() ; consolationMessage.remove();});

        this.page.append(resetButton);


        let instructions = document.createElement('p');
        instructions.setAttribute('position', 'relative');
        instructions.innerHTML = "Press your <strong>arrow keys</strong> to move around the tiles. Try it! You win when you merge enough together to create a 2048 tile. That is, if you can before the board fills up.";
        this.page.append(instructions);
        
        model.updateMove();

        window.onkeydown = (() => {this.listeners.forEach((l) => l(event))});
        // VScode says that event is deprecated here but creating a helper method here changes closure to the window, which can't access listeners.
    }

    addListener(l) {
        this.listeners.push(l);
    }

}