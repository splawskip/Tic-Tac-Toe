// Scaffold the game.
const Game = {
  /**
   * Object that holds references to various DOM elements used by the app.
   *
   * @property {NodeList} fields - The list of game field elements.
   */
  $: {
    fields: document.querySelectorAll('.field'),
  },
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
   * Checks if any player has won the game.
   *
   * @returns {void}
   */
  checkCombinations() {
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
      Game.winner = 'Player 1';
    } else if (player2Won) {
      Game.winner = 'Player 2';
    }
  },
  /**
   * Handles picking the field by the player.
   *
   * @param {Event} event - The click event.
   * @returns {void}
   */
  pick(event) {
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
    Game.checkCombinations();
  },
  /**
   * Binds app events.
   *
   * @returns {void}
   */
  bindEvents() {
    Game.$.fields.forEach((field) => field.addEventListener('click', Game.pick));
  },
  /**
   * Runs everything that should be invoked on app initialization.
   *
   * @returns {void}
   */
  init() {
    Game.bindEvents();
    Game.winner = null;
  },
};
// Start the game.
Game.init();
