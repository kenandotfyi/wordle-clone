const tileDisp = document.querySelector('.tile-container');
const keyboardDisp = document.querySelector('.key-container');
const messageDisp = document.querySelector('.message-container');

const wordle = 'SUPER';

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'Bksp',
];

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;

guessRows.forEach((row, rowIndex) => {
  const rowEl = document.createElement('div');
  rowEl.setAttribute('id', 'guessRow-' + rowIndex);
  row.forEach((guess, guessIndex) => {
    const tileEl = document.createElement('div');
    tileEl.setAttribute('id', 'guessRow-' + rowIndex + '-tile-' + guessIndex);
    tileEl.classList.add('tile');
    rowEl.append(tileEl);
  });
  tileDisp.append(rowEl);
});

keys.forEach((key) => {
  const buttonEl = document.createElement('button'); // create button elements
  buttonEl.setAttribute('id', key); // set the attributes
  buttonEl.addEventListener('click', () => handleKeyClick(key));
  buttonEl.textContent = key; // set the buttons' content to keys
  keyboardDisp.append(buttonEl); // put them into the keyboard container
});

const handleKeyClick = (key) => {
  console.log('clicked', key);
  if (key === 'Bksp') {
    deleteLetter(key);
    return;
  }
  if (key === 'ENTER') {
    checkRow();
    return;
  }
  addLetter(key);
};

const addLetter = (key) => {
  if (currentTile < 5 && currentRow < 6) {
    const tileToAddLetter = document.getElementById(
      'guessRow-' + currentRow + '-tile-' + currentTile
    );

    tileToAddLetter.textContent = key;
    guessRows[currentRow][currentTile] = key;
    tileToAddLetter.setAttribute('data', key);
    currentTile++;
    console.log(guessRows);
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tileToDelete = document.getElementById(
      'guessRow-' + currentRow + '-tile-' + currentTile
    );
    tileToDelete.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tileToDelete.setAttribute('data', '');
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join('');
  console.log(guess);
  if (currentTile > 4) {
    flipTile();
    if (guess == wordle) {
      showMessage('Magnificient!');
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = false;
        showMessage('game over!');
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const showMessage = (message) => {
  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageDisp.append(messageEl);
  setTimeout(() => messageDisp.removeChild(messageEl), 2000);
};

const addColorToKeyboard = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const flipTile = () => {
  const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
  rowTiles.forEach((tile, i) => {
    const dataLetter = tile.getAttribute('data');
    setTimeout(() => {
      tile.classList.add('flip');
      if (dataLetter == wordle[i]) {
        tile.classList.add('green-overlay');
        addColorToKeyboard(dataLetter, 'green-overlay');
      } else if (wordle.includes(dataLetter)) {
        tile.classList.add('yellow-overlay');
        addColorToKeyboard(dataLetter, 'yellow-overlay');
      } else {
        tile.classList.add('grey-overlay');
        addColorToKeyboard(dataLetter, 'grey-overlay');
      }
    }, 300 * i);
  });
};
