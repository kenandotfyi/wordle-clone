const tileDisp = document.querySelector('.tile-container');
const keyboardDisp = document.querySelector('.key-container');
const messageDisp = document.querySelector('.message-container');

let wordle;
let isGameOver = false;

const getWords = () => {
  fetch('http://localhost:8000/words')
    .then((resp) => resp.json())
    .then((json) => {
      console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};

getWords();

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
  // console.log('clicked', key);
  if (!isGameOver) {
    if (key === 'Bksp') {
      deleteLetter(key);
      return;
    }
    if (key === 'ENTER') {
      checkRow();
      return;
    }
    addLetter(key);
  }
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
    // console.log(guessRows);
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
  // console.log(guess);
  if (currentTile > 4) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((resp) => resp.json())
      .then((json) => {
        if (json == false) {
          showMessage('Kelime listede yok');
          return;
        } else {
          flipTile();
          if (guess == wordle) {
            showMessage('Harika!');
            isGameOver = true;
            return;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              showMessage('Oyun bitti!');
              return;
            }
            if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
            }
          }
        }
      })
      .catch((err) => console.log(err));
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

  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' });
  });

  guess.forEach((guess, i) => {
    if (guess.letter == wordle[i]) {
      guess.color = 'green-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = 'yellow-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });

  rowTiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add(guess[i].color);
      tile.classList.add('flip');
      addColorToKeyboard(guess[i].letter, guess[i].color);
    }, 300 * i);
  });
};
