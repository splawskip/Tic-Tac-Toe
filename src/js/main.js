import JSConfetti from 'js-confetti';

// Scaffold the game.
const Game = {
  /**
   * Object that holds references to various DOM elements used by the app.
   *
   * @type {object}
   *
   * @property {Element} circleScore - The element representing the circle's score.
   * @property {Element} drawScore - The element representing the draw score.
   * @property {Element} crossScore - The element representing the cross's score.
   * @property {Element} currentPlayer - The element representing the current player.
   * @property {NodeList} fields - The list of game field elements.
   * @property {Element} winnerContainer - The element representing the winner container.
   * @property {Element} playAgainButton - The element representing the play again button.
   */
  $: {
    circleScore: document.querySelector('[data-game="circle-score"]'),
    drawScore: document.querySelector('[data-game="draw-score"]'),
    crossScore: document.querySelector('[data-game="cross-score"]'),
    currentPlayer: document.querySelector('[data-game="current-player"]'),
    fields: document.querySelectorAll('[data-game="field"]'),
    winnerContainer: document.querySelector('[data-game="winner-container"]'),
    playAgainButton: document.querySelector('[data-game="play-again-button"]'),
  },
  /**
   * JSConfetti instance.
   *
   * @typedef {null|JSConfetti} JSConfetti
   */
  JSConfetti: null,
  /**
   * Circle player score.
   *
   * @type {number}
   */
  circleScore: 0,
  /**
   * Draw score.
   *
   * @type {number}
   */
  drawScore: 0,
  /**
   * Cross player score.
   *
   * @type {number}
   */
  crossScore: 0,
  /**
   * Winner.
   *
   * @type {null|string}
   */
  winner: null,
  /**
   * Player 1 symbol.
   *
   * @type {string}
   */
  player1: 'fa-circle',
  /**
   * Player 2 symbol.
   *
   * @type {string}
   */
  player2: 'fa-xmark',
  /**
   * Current round number.
   * @type {number}
   */
  round: 1,
  /**
   * Game board state.
   *
   * @type {Array<Array<string>>}
   */
  boardState: [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ],
  /**
   * Winning combinations on the game board.
   *
   * @type {Array<Array<number>>}
   */
  combinations: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  /**
   * Handles the reset event in the game.
   *
   * @returns {void}
   */
  handleReset() {
    // Hide play again button.
    Game.$.playAgainButton.classList.remove('button--active');
    // Remove players signs from the fields.
    Game.$.fields.forEach((field) => {
      // Get as classes as array.
      const classList = Array.from(field.classList);
      // Loop over classes and remove players signs.
      classList.forEach((className) => {
        if (className !== 'fa-solid' && className.startsWith('fa')) {
          field.classList.remove(className);
        }
      });
    });
    // Reset board state.
    Game.boardState = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    // Remove winner based styles.
    Game.$.winnerContainer.classList.remove(`${Game.winner}-winner`, 'draw');
    // Reset body of winner container.
    Game.$.winnerContainer.innerHTML = ``;
    // Reset winner.
    Game.winner = null;
  },
  /**
   * Handles the draw event in the game.
   *
   * @returns {void}
   */
  handleDraw() {
    // Apply draw styles to the winner container.
    Game.$.winnerContainer.classList.add('draw');
    // Sprinkle winner container with draw data.
    Game.$.winnerContainer.innerHTML = `
        <div class="winner-container__players players">
          <i class="fa-solid ${Game.player1}"></i>
          <i class="fa-solid ${Game.player2}"></i>
        </div>
        <p class="winner-container__result result">Draw!</p>
    `;
    // Throw boring confetti!
    Game.JSConfetti.addConfetti({
      emojis: ['🙌', '🥱', '🤝'],
      confettiNumber: 35,
    });
    // Show play again button.
    Game.$.playAgainButton.classList.add('button--active');
  },
  /**
   * Handles the win event in the game.
   *
   * @returns {void}
   */
  handleWin() {
    // Get boolean helper that tells if player two won.
    const didPlayerTwoWon = Game.winner === Game.player2;
    // Apply styles to winner container based on the winner.
    Game.$.winnerContainer.classList.add(`${Game.winner}-winner`);
    // Sprinkle winner container with data about winner.
    Game.$.winnerContainer.innerHTML = `
      <i class="fa-solid ${Game.winner}"></i>
      <p class="result">${didPlayerTwoWon ? 'Cross' : 'Circle'} wins!</p>
    `;
    // Throw confetti!
    Game.JSConfetti.addConfetti({
      emojis: [didPlayerTwoWon ? '❌' : '⭕️', '🎉', '🎊', '🍬', '🥳', '🏆'],
      confettiNumber: 35,
    });
    // Show play again button.
    Game.$.playAgainButton.classList.add('button--active');
  },
  /**
   * Checks if any player has won the game.
   *
   * @returns {void}
   */
  handleCombinationsCheck() {
    // Get current board state in one dimmension.
    const flattenedBoardState = Game.boardState.flat();
    // Container for players moves.
    const moves = {
      'fa-circle': [],
      'fa-xmark': [],
    };
    // Loop over board state and if field belongs to the players assign field index to the right player.
    flattenedBoardState.forEach((field, index) => {
      if (moves[field]) {
        moves[field].push(index);
      }
    });
    // Get if player 1 won.
    const player1won = Game.combinations.some((combination) =>
      combination.every((index) => moves[Game.player1].includes(index))
    );
    // Get if player 2 won.
    const player2Won = Game.combinations.some((combination) =>
      combination.every((index) => moves[Game.player2].includes(index))
    );
    // Check if player 1 won.
    if (player1won) {
      // Assign winner.
      Game.winner = Game.player1;
      // Update score board.
      Game.$.circleScore.textContent = Game.circleScore + 1;
    }
    // Check if player 2 won.
    if (player2Won) {
      // Assign winner.
      Game.winner = Game.player2;
      // Update score board.
      Game.$.crossScore.textContent = Game.crossScore + 1;
    }
    // Check if we we are dealing with a win.
    if (Game.winner) {
      Game.handleWin();
    }
    // Check if we are dealing with a draw.
    if (Game.boardState.flat().every((field) => field !== '') && !Game.winner) {
      Game.handleDraw();
      // Update score board.
      Game.$.drawScore.textContent = Game.drawScore + 1;
    }
  },
  /**
   * Handles picking the field by the player.
   *
   * @param {Event} event - The click event.
   * @returns {void}
   */
  handlePick(event) {
    // Get current player.
    const currentPlayer = Game.round % 2 === 0;
    // Get field row and col.
    const { row, column } = event.target.dataset;
    // Get current player sign.
    const currentPlayerSign = currentPlayer ? Game.player2 : Game.player1;
    // If selected field is already filled, bail.
    if (Game.boardState[row][column] !== '') return;
    // Update player turn.
    Game.$.currentPlayer.textContent = currentPlayer ? 'circle' : 'cross';
    // Mark picked field with current user avatar.
    event.target.classList.add(currentPlayerSign);
    // Update board state.
    Game.boardState[row][column] = currentPlayerSign;
    // Bump the round variable.
    Game.round += 1;
    // Check if someone won.
    Game.handleCombinationsCheck();
  },
  /**
   * Binds app events.
   *
   * @returns {void}
   */
  bindEvents() {
    Game.$.fields.forEach((field) => field.addEventListener('click', Game.handlePick));
    Game.$.playAgainButton.addEventListener('click', Game.handleReset);
  },
  /**
   * Sets the instances of other classes used by the app.
   *
   * @returns {void}
   */
  setInstances() {
    Game.JSConfetti = new JSConfetti();
  },
  /**
   * Runs everything that should be invoked on app initialization.
   *
   * @returns {void}
   */
  init() {
    Game.setInstances();
    Game.bindEvents();
  },
};
// Start the game.
Game.init();
