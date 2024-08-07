function game3() { // Updated
    const highScoreStreak = localStorage.getItem('highScoreStreakGame3') || 0; // Updated
    const currentStreak = localStorage.getItem('currentStreakGame3') || 0; // Updated
    const gameHTML = `
        <h2>Game 3: Memory Grid</h2> <!-- Updated -->
        <div>High Score Streak: <span id="highScoreGame3">${highScoreStreak}</span></div> <!-- Updated -->
        <div>Current Streak: <span id="currentStreakGame3">${currentStreak}</span></div> <!-- Updated -->
        <div class="slider-container">
            <label for="gridSize3">Grid Size: <span id="gridSizeValue3">7</span>x<span id="gridSizeValue3">7</span></label> <!-- Updated -->
            <input type="range" id="gridSize3" class="slider" min="4" max="10" value="7"> <!-- Updated -->
        </div>
        <div class="slider-container">
            <label for="numLitCubes">Number of Lit Cubes: <span id="numLitCubesValue">12</span></label>
            <input type="range" id="numLitCubes" class="slider" min="5" max="20" value="12">
        </div>
        <div id="game3-board"></div> <!-- Updated -->
        <button id="startButton3">Start Game</button> <!-- Updated -->
        <p id="message3"></p> <!-- Updated -->
    `;
    setTimeout(initializeGame3, 0); // Delay to allow DOM update
    return gameHTML;
}

function initializeGame3() { // Updated
    const game3Board = document.getElementById('game3-board'); // Updated
    const startButton = document.getElementById('startButton3'); // Updated
    const message = document.getElementById('message3'); // Updated
    const gridSizeSlider = document.getElementById('gridSize3'); // Updated
    const gridSizeValue = document.getElementById('gridSizeValue3'); // Updated
    const numLitCubesSlider = document.getElementById('numLitCubes');
    const numLitCubesValue = document.getElementById('numLitCubesValue');
    const highScoreElement = document.getElementById('highScoreGame3'); // Updated
    const currentStreakElement = document.getElementById('currentStreakGame3'); // Updated

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
        game3Board.innerHTML = '';
        const totalCubes = gridSize * gridSize;
        let litCubes = [];
        let playerSequence = [];

        // Create the board
        game3Board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        for (let i = 0; i < totalCubes; i++) {
            const cube = document.createElement('div');
            cube.classList.add('cube');
            cube.dataset.index = i;
            game3Board.appendChild(cube);
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
            game3Board.childNodes.forEach(cube => cube.addEventListener('click', handleCubeClick));
        }

        function disablePlayerInput() {
            game3Board.childNodes.forEach(cube => cube.removeEventListener('click', handleCubeClick));
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
            let highScoreStreak = parseInt(localStorage.getItem('highScoreStreakGame3') || '0'); // Updated
            let currentStreak = parseInt(localStorage.getItem('currentStreakGame3') || '0'); // Updated
            if (won) {
                currentStreak++;
                if (currentStreak > highScoreStreak) {
                    highScoreStreak = currentStreak;
                    localStorage.setItem('highScoreStreakGame3', highScoreStreak); // Updated
                    highScoreElement.textContent = highScoreStreak;
                }
            } else {
                currentStreak = 0;
            }
            localStorage.setItem('currentStreakGame3', currentStreak); // Updated
            currentStreakElement.textContent = currentStreak;
        }
    }
}
