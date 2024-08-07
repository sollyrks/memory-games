function game1() {
    const highScore = localStorage.getItem('highScoreGame1') || 0;
    const gameHTML = `
        <h2>Game 1: Match the Pairs</h2>
        <div>High Score: <span id="highScoreGame1">${highScore}</span></div>
        <div class="slider-container">
            <label for="gridSize1">Grid Size: <span id="gridSizeValue1">4</span>x<span id="gridSizeValue1">4</span></label>
            <input type="range" id="gridSize1" class="slider" min="2" max="6" value="4">
        </div>
        <div id="game1-board"></div>
        <button id="startButton1">Start Game</button>
    `;
    setTimeout(initializeGame1, 0); // Delay to allow DOM update
    return gameHTML;
}

function initializeGame1() {
    const game1Board = document.getElementById('game1-board');
    const startButton = document.getElementById('startButton1');
    const gridSizeSlider = document.getElementById('gridSize1');
    const gridSizeValue = document.getElementById('gridSizeValue1');
    const highScoreElement = document.getElementById('highScoreGame1');

    let gridSize = gridSizeSlider.value;
    gridSizeValue.textContent = gridSize;
    let moves = 0;

    gridSizeSlider.addEventListener('input', () => {
        gridSize = gridSizeSlider.value;
        gridSizeValue.textContent = gridSize;
    });

    startButton.addEventListener('click', startGame);

    function startGame() {
        game1Board.innerHTML = '';
        moves = 0;
        const totalCards = gridSize * gridSize;
        const cards = [];
        for (let i = 0; i < totalCards / 2; i++) {
            cards.push(i);
            cards.push(i);
        }
        let shuffledCards = cards.sort(() => 0.5 - Math.random());
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;

        game1Board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        game1Board.style.gridGap = '1px';
        game1Board.style.display = 'grid';

        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.card = card;
            cardElement.innerHTML = `<span>?</span>`;
            cardElement.addEventListener('click', flipCard);
            game1Board.appendChild(cardElement);
        });

        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;

            this.innerHTML = `<span>${this.dataset.card}</span>`;

            if (!firstCard) {
                firstCard = this;
                return;
            }

            secondCard = this;
            lockBoard = true;

            if (firstCard.dataset.card === secondCard.dataset.card) {
                firstCard = null;
                secondCard = null;
                lockBoard = false;
                checkWin();
            } else {
                setTimeout(() => {
                    firstCard.innerHTML = `<span>?</span>`;
                    secondCard.innerHTML = `<span>?</span>`;
                    firstCard = null;
                    secondCard = null;
                    lockBoard = false;
                }, 1000);
            }
        }

        function checkWin() {
            moves++;
            const allCards = Array.from(document.getElementsByClassName('card'));
            const matchedCards = allCards.filter(card => card.innerHTML !== `<span>?</span>`);
            if (matchedCards.length === totalCards) {
                const highScore = localStorage.getItem('highScoreGame1') || 0;
                if (moves < highScore || highScore === 0) {
                    localStorage.setItem('highScoreGame1', moves);
                    highScoreElement.textContent = moves;
                }
                alert(`You won in ${moves} moves!`);
            }
        }
    }
}
