function game4() {
    const highScoreStreak = localStorage.getItem('highScoreStreakGame4') || 0;
    const currentStreak = localStorage.getItem('currentStreakGame4') || 0;
    const gameHTML = `
        <h2>Game 4: Memory Grid</h2>
        <div>High Score Streak: <span id="highScoreGame4">${highScoreStreak}</span></div>
        <div>Current Streak: <span id="currentStreakGame4">${currentStreak}</span></div>
        <div class="slider-container">
            <label for="gridSize4">Grid Size: <span id="gridSizeValue4">7</span>x<span id="gridSizeValue4">7</span></label>
            <input type="range" id="gridSize4" class="slider" min="4" max="10" value="7">
        </div>
        <div class="slider-container">
            <label for="numLitCubes">Number of Lit Cubes: <span id="numLitCubesValue">12</span></label>
            <input type="range" id="numLitCubes" class="slider" min="5" max="20" value="12">
        </div>
        <div id="game4-board"></div>
        <button id="startButton4">Start Game</button>
        <p id="message4"></p>
    `;
    setTimeout(initializeGame4, 0); // Delay to allow DOM update
    return gameHTML;
}

function initializeGame4() {
    const game4Board = document.getElementById('game4-board');
    const startButton = document.getElementById('startButton4');
    const message = document.getElementById('message4');
    const gridSizeSlider = document.getElementById('gridSize4');
    const gridSizeValue = document.getElementById('gridSizeValue4');
    const numLitCubesSlider = document.getElementById('numLitCubes');
    const numLitCubesValue = document.getElementById('numLitCubesValue');
    const highScoreElement = document.getElementById('highScoreGame4');
    const currentStreakElement = document.getElementById('currentStreakGame4');

    let gridSize = gridSizeSlider.value;
    let numLitCubes = numLitCubesSlider.value;
    gridSizeValue.textContent = gridSize;
    numLitCubesValue.textContent = numLitCubes;

    gridSizeSlider.addEventListener('input', () => {
        gridSize = gridSizeSlider.value;
        gridSizeValue.textContent = gridSize;
    });

    numLitCubesSlider.addEventListener('input', () => {
        numLitCubes = numLitCubesSlider.value;
        numLitCubesValue.textContent = numLitCubes;
    });

    startButton.addEventListener('click', startGame);

    function startGame() {
        game4Board.innerHTML = '';
        const totalCubes = gridSize * gridSize;
        let litCubes = [];
        let playerSequence = [];

        // Create the board
        game4Board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        for (let i = 0; i < totalCubes; i++) {
            const cube = document.createElement('div');
            cube.classList.add('cube');
            cube.dataset.index = i;
            game4Board.appendChild(cube);
        }

        // Randomly light up cubes
        const indices = Array.from(Array(totalCubes).keys());
        indices.sort(() => Math.random() - 0.5);
        litCubes = indices.slice(0, numLitCubes);

        litCubes.forEach(index => {
            const cube = document.querySelector(`.cube[data-index="${index}"]`);
            cube.classList.add('active');
        });

        // Hide the lit cubes after 5 seconds
        setTimeout(() => {
            litCubes.forEach(index => {
                const cube = document.querySelector(`.cube[data-index="${index}"]`);
                cube.classList.remove('active');
            });
            enablePlayerInput();
        }, 5000);

        function enablePlayerInput() {
            game4Board.childNodes.forEach(cube => cube.addEventListener('click', handleCubeClick));
        }

        function disablePlayerInput() {
            game4Board.childNodes.forEach(cube => cube.removeEventListener('click', handleCubeClick));
        }

        function handleCubeClick(event) {
            const index = parseInt(event.target.dataset.index);
            playerSequence.push(index);

            if (litCubes.includes(index)) {
                event.target.classList.add('active');
                if (playerSequence.length === litCubes.length) {
                    updateStreak(true);
                    message.innerText = 'Congratulations! You found all the lit cubes!';
                }
            } else {
                event.target.classList.add('wrong');
                updateStreak(false);
                message.innerText = 'Wrong cube! Game Over!';
                disablePlayerInput();
            }
        }

        function updateStreak(won) {
            let highScoreStreak = parseInt(localStorage.getItem('highScoreStreakGame4') || '0');
            let currentStreak = parseInt(localStorage.getItem('currentStreakGame4') || '0');
            if (won) {
                currentStreak++;
                if (currentStreak > highScoreStreak) {
                    highScoreStreak = currentStreak;
                    localStorage.setItem('highScoreStreakGame4', highScoreStreak);
                    highScoreElement.textContent = highScoreStreak;
                }
            } else {
                currentStreak = 0;
            }
            localStorage.setItem('currentStreakGame4', currentStreak);
            currentStreakElement.textContent = currentStreak;
        }
    }
}
