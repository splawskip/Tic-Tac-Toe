import JSConfetti from 'js-confetti';

// Scaffold the game.
const Game = {
  /**
   * Object that holds references to various DOM elements used by the app.
   *
   * @property {NodeList} fields - The list of game field elements.
   */
  $: {
    fields: document.querySelectorAll('[data-game="field"]'),
    winnerContainer: document.querySelector('[data-game="winner-container"]'),
    playAgainButton: document.querySelector('[data-game="play-again"]'),
  },
  /**
   * JSConfetti instance.
   *
   * @typedef {null|JSConfetti} JSConfetti
   */
  JSConfetti: null,
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
    Game.$.playAgainButton.classList.remove('active');
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
    Game.$.winnerContainer.classList.remove(`${Game.winner}-winner`);
    // Reset body of winner container.
    Game.$.winnerContainer.innerHTML = ``;
    // Reset winner.
    Game.winner = null;
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
      <i class="winner-sign fa-solid ${Game.winner}"></i>
      <p class="winner-name">Circle wins!</p>
    `;
    // Throw confetti!
    Game.JSConfetti.addConfetti({
      emojis: [didPlayerTwoWon ? '❌' : '⭕️', '🎉', '🎊', '🍬', '🥳', '🏆'],
      confettiNumber: 50,
    });
    // show play again button.
    Game.$.playAgainButton.classList.add('active');
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
    // Resolve winner.
    if (player1won) {
      Game.winner = Game.player1;
    } else if (player2Won) {
      Game.winner = Game.player2;
    }
    // If we got a winner run win handler.
    if (Game.winner) {
      Game.handleWin();
    }
  },
  /**
   * Handles picking the field by the player.
   *
   * @param {Event} event - The click event.
   * @returns {void}
   */
  handlePick(event) {
    // Get field row and col.
    const { row, column } = event.target.dataset;
    // Get current player.
    const currentPlayer = Game.round % 2 === 0 ? Game.player2 : Game.player1;
    // If selected field is already filled, bail.
    if (Game.boardState[row][column] !== '') return;
    // Mark picked field with current user avatar.
    event.target.classList.add(currentPlayer);
    // Update board state.
    Game.boardState[row][column] = currentPlayer;
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
