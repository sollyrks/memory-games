function game1() {
    const highScore = localStorage.getItem('highScoreGame1') || 0;
    const gameHTML = `
        <h2>Game 1: Match the Pairs</h2>
        <div>High Score: <span id="highScoreGame1">${highScore}</span></div>
        <div class="slider-container">
            <label for="gridSize1">Grid Size: <span id="gridSizeValue1">4</span>x<span id="gridSizeValue1">4</span></label>
            <input type="range" id="gridSize1" class="slider" min="2" max="10" value="4">
        </div>
        <div id="game1-board" class="grid"></div>
        <button id="startButton1">Start Game</button>
        <p id="message1"></p>
    `;
    setTimeout(initializeGame1, 0); // Delay to allow DOM update
    return gameHTML;
}

function initializeGame1() {
    const game1Board = document.getElementById('game1-board');
    const startButton = document.getElementById('startButton1');
    const message = document.getElementById('message1');
    const gridSizeSlider = document.getElementById('gridSize1');
    const gridSizeValue = document.getElementById('gridSizeValue1');
    const highScoreElement = document.getElementById('highScoreGame1');

    let gridSize = gridSizeSlider.value;
    gridSizeValue.textContent = gridSize;

    gridSizeSlider.addEventListener('input', () => {
        gridSize = gridSizeSlider.value;
        gridSizeValue.textContent = gridSize;
    });

    startButton.addEventListener('click', startGame);

    function startGame() {
        game1Board.innerHTML = '';
        const totalCards = gridSize * gridSize;
        const cardValues = [];
        for (let i = 1; i <= totalCards / 2; i++) {
            cardValues.push(i, i);
        }
        cardValues.sort(() => Math.random() - 0.5);

        // Create the board
        game1Board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = cardValues[i];
            card.innerHTML = '<span>?</span>';
            game1Board.appendChild(card);
        }

        let firstCard = null;
        let secondCard = null;
        let matches = 0;

        game1Board.childNodes.forEach(card => card.addEventListener('click', handleCardClick));

        function handleCardClick(event) {
            if (firstCard && secondCard) return;

            const clickedCard = event.target;
            if (!clickedCard.classList.contains('card')) return;

            clickedCard.innerHTML = `<span>${clickedCard.dataset.value}</span>`;
            clickedCard.classList.add('flipped');

            if (!firstCard) {
                firstCard = clickedCard;
            } else {
                secondCard = clickedCard;
                checkForMatch();
            }
        }

        function checkForMatch() {
            if (firstCard.dataset.value === secondCard.dataset.value) {
                firstCard = null;
                secondCard = null;
                matches++;
                if (matches === totalCards / 2) {
                    updateHighScore();
                    message.innerText = 'Congratulations! You matched all pairs!';
                }
            } else {
                setTimeout(() => {
                    firstCard.innerHTML = '<span>?</span>';
                    secondCard.innerHTML = '<span>?</span>';
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    firstCard = null;
                    secondCard = null;
                }, 1000);
            }
        }

        function updateHighScore() {
            let highScore = parseInt(localStorage.getItem('highScoreGame1') || '0');
            if (matches > highScore) {
                highScore = matches;
                localStorage.setItem('highScoreGame1', highScore);
                highScoreElement.textContent = highScore;
            }
        }
    }
}
