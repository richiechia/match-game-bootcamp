// Please implement exercise logic here

/// //////// HELPER FUNCTIONS ////////////////
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    // console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
      } else if (cardName === '11') {
        cardName = 'jack';
      } else if (cardName === '12') {
        cardName = 'queen';
      } else if (cardName === '13') {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle the cards
const shuffleCards = (cardDeck) => {
  // Loop over card deck
  let currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cardDeck.length);
    // Random card and Current Card
    const randomCard = cardDeck[randomIndex];
    const currentCard = cardDeck[currentIndex];
    // Swap positions with current position with random position;
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex += 1;
  }
  return cardDeck;
};

/// ///////////////// GLOBAL VARIABLE //////////////////
// // boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let secondCard = null;
let deck;
let canClick = true;
let playerName = '';

/// ///////////////////// Gameplay Logic //////////////////////
const squareClick = (messageBoard, cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null && canClick === true) {
    canClick = false;
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    canClick = true;
    secondCard = null;

    // second turn
  }
  else if (secondCard === null && canClick === true) {
    console.log('second turn');
    canClick = false;

    cardElement.innerText = clickedCard.name;

    setTimeout(() => {
      if (
        clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
      ) {
        console.log('match');
        messageBoard.innerHTML = 'Match';

        // turn this card over
        cardElement.innerText = clickedCard.name;
      } else {
        console.log('NOT a match');
        messageBoard.innerHTML = 'NOT a match';

        // turn this card back over
        firstCardElement.innerText = '';
        cardElement.innerText = '';
      }

      // reset the first card
      firstCard = null;
      secondCard = true;
      canClick = true;
    }, 3000);
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (messageBoard, board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');
  // give it a class for CSS purposes
  boardElement.classList.add('board');
  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];
    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');
      // set a class for CSS purposes
      square.classList.add('square');
      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(messageBoard, event.currentTarget, i, j);
      });
      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }
  console.log(boardElement);
  return boardElement;
};

const buildTimerElements = (messageBoard) => {
  let ref;
  let minutes = 3;
  let seconds = 0;
  let canStart = true;

  const startTimer = () => {
    const delayInMilliseconds = 1000;
    if (canStart === false) {
      return;
    }
    messageBoard.innerText = 'click on a square';
    canClick = true;

    ref = setInterval(() => {
      display.innerHTML = `${minutes} minutes ${seconds} seconds`;
      if (seconds === 0) {
        minutes -= 1;
        seconds = 60;
      }
      if (minutes < 0) {
        clearInterval(ref);
        canStart = true;
        canClick = false;
        messageBoard.innerHTML = 'Times up! Click the reset button to restart';
      }
      seconds -= 1;
    }, delayInMilliseconds);

    canStart = false;
  };
  const stopTimer = () => {
    clearInterval(ref);
    canStart = true;
    // prevents user from clicking on the squares when timer is paused
    canClick = false;
    messageBoard.innerText = 'click start to resume game';
  };

  const resetTimer = () => {
    minutes = 3;
    seconds = 0;
    canStart = true;
    canClick = true;
    display.innerHTML = `${minutes} minutes ${seconds} seconds`;
    messageBoard.innerHTML = 'Click start to begin';
  };
  // all the timer elements contain here
  const timerContainer = document.createElement('div');
  timerContainer.classList.add('timer-container');

  // the timer's display and the container which it will go in
  const timerTop = document.createElement('div');
  timerContainer.appendChild(timerTop);

  const display = document.createElement('div');
  display.classList.add('timer-display');
  display.innerHTML = `${minutes} minutes ${seconds} seconds`;
  timerTop.appendChild(display);

  // the timer's buttons and the container which it will go in
  const timerBottom = document.createElement('div');
  timerContainer.appendChild(timerBottom);
  const startButton = document.createElement('button');
  startButton.classList.add('btn');
  startButton.innerText = 'START';

  // Start button functionality
  startButton.addEventListener('click', startTimer);
  timerBottom.appendChild(startButton);
  const stopButton = document.createElement('button');
  stopButton.classList.add('btn');
  stopButton.innerText = 'STOP';
  // Stop button functionality
  stopButton.addEventListener('click', stopTimer);
  timerBottom.appendChild(stopButton);
  // Reset Button
  const resetButton = document.createElement('button');
  resetButton.classList.add('btn');
  resetButton.innerText = 'RESET';
  resetButton.addEventListener('click', resetTimer);
  timerBottom.appendChild(resetButton);

  return timerContainer;
};

/// ///// Game Initilisation//////////
const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  if (playerName.length === 0) {
    const nameDiv = document.createElement('div');
    nameDiv.id = 'name';

    const msg = document.createElement('p');
    msg.innerText = 'Please key in name and press enter';
    nameDiv.appendChild(msg);

    const nameInput = document.createElement('input');
    nameInput.id = 'name-input';
    nameInput.classList.add('name-input');
    nameDiv.appendChild(nameInput);

    document.body.appendChild(nameDiv);
  }

  const messageBoard = document.createElement('div');
  messageBoard.classList.add('messages');
  messageBoard.innerText = 'click start to begin';
  document.body.appendChild(messageBoard);

  const boardEl = buildBoardElements(messageBoard, board);
  document.body.appendChild(boardEl);

  const timerEl = buildTimerElements(messageBoard);
  document.body.appendChild(timerEl);
};

initGame();

// // console.log('starting...');
// // const delayInMilliseconds = 1000; // this is one second
// // const ref = setInterval(() => {
// //   console.log(`I happen after ${delayInMilliseconds}`);
// // }, delayInMilliseconds);
// // console.log('bananas!');

// console.log('starting...');
// const delayInMilliseconds = 1000; // this is one second
// let counter = 0;
// const ref = setInterval(() => {
//   console.log(`I happen after ${delayInMilliseconds}`);
//   console.log(counter);
//   counter += 1;
//   if (counter > 10) {
//     clearInterval(ref);
//   }
// }, delayInMilliseconds);
// console.log('bananas!');

document.addEventListener('keydown', (event) => {
  if (event.key == 'Enter' && playerName.length == 0) {
    playerName = document.getElementById('name-input').value;
    console.log(playerName);
  }
});
