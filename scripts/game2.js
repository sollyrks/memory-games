function game2() {
    const highScore = localStorage.getItem('highScoreGame2') || 0;
    const gameHTML = `
        <h2>Game 2: Simon Says</h2>
        <div>High Score: <span id="highScoreGame2">${highScore}</span></div>
        <div class="slider-container">
            <label for="gridSize2">Grid Size: <span id="gridSizeValue2">2</span>x<span id="gridSizeValue2">2</span></label>
            <input type="range" id="gridSize2" class="slider" min="2" max="6" value="2">
        </div>
        <div id="game2-board"></div>
        <button id="startButton2">Start Game</button>
        <p id="message2"></p>
    `;
    setTimeout(initializeGame2, 0); // Delay to allow DOM update
    return gameHTML;
}

function initializeGame2() {
    const game2Board = document.getElementById('game2-board');
    const startButton = document.getElementById('startButton2');
    const message = document.getElementById('message2');
    const gridSizeSlider = document.getElementById('gridSize2');
    const gridSizeValue = document.getElementById('gridSizeValue2');
    const highScoreElement = document.getElementById('highScoreGame2');

    let gridSize = gridSizeSlider.value;
    gridSizeValue.textContent = gridSize;
    let level = 0;
    let sequence = [];
    let playerSequence = [];

    gridSizeSlider.addEventListener('input', () => {
        gridSize = gridSizeSlider.value;
        gridSizeValue.textContent = gridSize;
    });

    startButton.addEventListener('click', startGame);

    function startGame() {
        game2Board.innerHTML = '';
        message.innerText = '';
        level = 0;
        sequence = [];
        playerSequence = [];
        const totalCells = gridSize * gridSize;

        game2Board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        game2Board.style.gridGap = '1px';
        game2Board.style.display = 'grid';

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('color');
            cell.dataset.index = i;
            game2Board.appendChild(cell);
        }

        nextLevel();
    }

    function nextLevel() {
        level++;
        playerSequence = [];
        const nextCell = Math.floor(Math.random() * (gridSize * gridSize));
        sequence.push(nextCell);
        showSequence();
    }

    function showSequence() {
        let index = 0;
        const interval = setInterval(() => {
            flashCell(sequence[index]);
            index++;
            if (index >= sequence.length) {
                clearInterval(interval);
                enablePlayerInput();
            }
        }, 1000);
    }

    function flashCell(index) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('active');
        setTimeout(() => {
            cell.classList.remove('active');
        }, 500);
    }

    function enablePlayerInput() {
        game2Board.childNodes.forEach(cell => cell.addEventListener('click', handleColorClick));
    }

    function disablePlayerInput() {
        game2Board.childNodes.forEach(cell => cell.removeEventListener('click', handleColorClick));
    }

    function handleColorClick(event) {
        const index = parseInt(event.target.dataset.index);
        playerSequence.push(index);

        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            message.innerText = 'Wrong sequence! Game Over!';
            updateHighScore();
            disablePlayerInput();
        } else if (playerSequence.length === sequence.length) {
            disablePlayerInput();
            setTimeout(nextLevel, 1000);
        }
    }

    function updateHighScore() {
        const highScore = localStorage.getItem('highScoreGame2') || 0;
        if (level > highScore) {
            localStorage.setItem('highScoreGame2', level);
            highScoreElement.textContent = level;
        }
    }
}
