function game2() {
    const highScore = localStorage.getItem('highScoreGame2') || 0;
    const gameHTML = `
        <h2>Game 2: Simon Says</h2>
        <div>High Score: <span id="highScoreGame2">${highScore}</span></div>
        <div class="slider-container">
            <label for="gridSize2">Grid Size: <span id="gridSizeValue2">2</span>x<span id="gridSizeValue2">2</span></label>
            <input type="range" id="gridSize2" class="slider" min="2" max="10" value="2">
        </div>
        <div id="game2-board" class="grid"></div>
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

    gridSizeSlider.addEventListener('input', () => {
        gridSize = gridSizeSlider.value;
        gridSizeValue.textContent = gridSize;
    });

    startButton.addEventListener('click', startGame);

    function startGame() {
        game2Board.innerHTML = '';
        const totalColors = gridSize * gridSize;
        const colors = Array.from({ length: totalColors }, (_, i) => i);

        // Create the board
        game2Board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        for (let i = 0; i < totalColors; i++) {
            const color = document.createElement('div');
            color.classList.add('color');
            color.dataset.index = i;
            game2Board.appendChild(color);
        }

        let sequence = [];
        let playerSequence = [];
        let level = 0;

        function nextSequence() {
            level++;
            playerSequence = [];
            const randomIndex = Math.floor(Math.random() * totalColors);
            sequence.push(randomIndex);
            showSequence();
        }

        function showSequence() {
            let delay = 500;
            sequence.forEach((index, i) => {
                setTimeout(() => {
                    const color = document.querySelector(`.color[data-index="${index}"]`);
                    color.classList.add('active');
                    setTimeout(() => {
                        color.classList.remove('active');
                    }, 500);
                }, delay * (i + 1));
            });
            setTimeout(enablePlayerInput, delay * (sequence.length + 1));
        }

        function enablePlayerInput() {
            game2Board.childNodes.forEach(color => color.addEventListener('click', handleColorClick));
        }

        function disablePlayerInput() {
            game2Board.childNodes.forEach(color => color.removeEventListener('click', handleColorClick));
        }

        function handleColorClick(event) {
            const index = parseInt(event.target.dataset.index);
            playerSequence.push(index);
            event.target.classList.add('active');
            setTimeout(() => {
                event.target.classList.remove('active');
                checkPlayerSequence();
            }, 500);
        }

        function checkPlayerSequence() {
            const lastIndex = playerSequence.length - 1;
            if (playerSequence[lastIndex] !== sequence[lastIndex]) {
                message.innerText = 'Game Over! Wrong color!';
                disablePlayerInput();
                updateHighScore();
                return;
            }
            if (playerSequence.length === sequence.length) {
                disablePlayerInput();
                nextSequence();
            }
        }

        function updateHighScore() {
            let highScore = parseInt(localStorage.getItem('highScoreGame2') || '0');
            if (level > highScore) {
                highScore = level;
                localStorage.setItem('highScoreGame2', highScore);
                highScoreElement.textContent = highScore;
            }
        }

        nextSequence();
    }
}
