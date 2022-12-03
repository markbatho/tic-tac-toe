const gameBoard = (() => {
  const board = document.getElementById('board');
  let squares = Array(9).fill(null);

  render();

  const getBoard = () => board;
  const getSquares = () => squares;

  function render() {
    board.replaceChildren();
    squares.forEach((square, index) => {
      const div = document.createElement('div');
      div.dataset.id = index;
      div.className = 'square';
      div.textContent = square;
      board.appendChild(div);
    });
  }

  function reset() {
    squares = Array(9).fill(null);
    render();
  }

  function placeMarker(marker, index) {
    if (squares[index] === null) {
      squares[index] = marker;
      render();
    }
  }

  return {
    getBoard,
    getSquares,
    reset,
    placeMarker
  };
})();

const game = ((gameBoard) => {
  const startBtn = document.getElementById('start');
  const display = document.getElementById('display');
  let players = [];
  let prev = null;
  let current = null;
  let winner = null;
  let turn = 0;
  
  startBtn.addEventListener('click', createPlayers);

  function createPlayers() {
    const playerX = Player(prompt('Enter player X\'s name: ', 'Player X'), 'X');
    const playerO = Player(prompt('Enter player O\'s name: ', 'Player O'), 'O');
    players.push(playerX, playerO);
    prev = playerO;
    current = playerX;
    display.textContent = 'Let\'s start ' + playerX.getName() + '!';

    startBtn.removeEventListener('click', createPlayers);
    startBtn.addEventListener('click', reset);
    startBtn.textContent = 'Reset';

    play();
  }

  function makeMove(e) {
    if (e.target.className === 'square') {
      if (e.target.textContent !== '') {
        return;
      }

      if (winner) {
        return;
      }

      turn++;
      gameBoard.placeMarker(current.getMarker(), e.target.dataset.id);
      display.textContent = 'Next move: ' + prev.getName();
      winner = checkWinner(gameBoard.getSquares());

      let temp;
      temp = current;
      current = prev;
      prev = temp;
      
      if (winner) {
        display.textContent = 'The winner is: ' + prev.getName();
        return;
      }

      if (turn === 9 && winner === null) {
        display.textContent = 'It\'s a tie!';
      }
    }
  }

  function checkWinner(squares) {
    let winner = null;
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    winningLines.forEach(line => {
      let squareValues = [];
      
      line.forEach(item => {
        squareValues.push(squares[item]);
      });

      const hasWinner = squareValues.every((val, i, arr) => {
        if (arr[0] !== null) {
          return val === arr[0];
        }
        return false;
      });

      if (hasWinner) winner = squareValues[0];
    });

    return winner;
  }

  function play() {
    gameBoard.getBoard().addEventListener('click', makeMove);
  }

  function reset() {
    gameBoard.getBoard().removeEventListener('click', makeMove);
    players = [];
    turn = 0;
    prev = null;
    current = null;
    winner = null;
    gameBoard.reset();
    startBtn.removeEventListener('click', reset);
    startBtn.addEventListener('click', createPlayers);
    startBtn.textContent = 'Start';
    display.textContent = null;
  }

})(gameBoard);

const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};
