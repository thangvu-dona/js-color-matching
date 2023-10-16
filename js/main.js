import { GAME_STATUS, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getColorListElement, getInActiveColorList, getPlayAgainButton, getTimerElement } from './selectors.js';
import { getRandomColorPairs, hidePlayAgainButton, setTimerText, showPlayAgainButton } from './utils.js';

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING

// console.log(getRandomColorPairs(PAIRS_COUNT));

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColors() {
  // random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT);

  // bind to li > overlay
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];

    const overlayElement = liElement.querySelector('.overlay');
    overlayElement.style.background = colorList[index];
  });
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
  const isClicked = liElement.classList.contains('active');
  if(!liElement || isClicked || shouldBlockClick) return;

  // show color when click cell
  liElement.classList.add('active');
  
  // save clicked cell to selections
  selections.push(liElement);
  if (selections.length < 2) return;

  // check match
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;

  if (isMatch) {
    // check win
    const isWin = getInActiveColorList().length === 0;
    if (isWin) {
      // set timer text
      setTimerText('YOU WIN! 🎉');

      // show play again button
      showPlayAgainButton();

      gameStatus = GAME_STATUS.FINISHED;
    }

    // reset selections
    selections = [];

    return;
  }

  // in case not match
  gameStatus = GAME_STATUS.BLOCKING;

  // remove class active from 2 li element
  setTimeout(() => {
    selections[0].classList.remove('active');
    selections[1].classList.remove('active');

    // reset selections
    selections = [];

    gameStatus = GAME_STATUS.PLAYING;
  }, 300);
}

function attachEventForColorList() {
  const ulElement = getColorListElement();
  if (!ulElement) return;
  // add event for li from ul through event delegate technic
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;
    handleColorClick(event.target);
  });
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (playAgainButton) {
    playAgainButton.addEventListener('click', resetGame);
  }
}

function resetGame() {
  // reset global variable
  gameStatus = GAME_STATUS.PLAYING;
  selections = [];

  // reset DOM elements
  // - remove active class from li
  // - clear you win / timeout text
  // - hide play again button
  const colorElementList = getColorElementList();
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active');
  }
  setTimerText('');
  hidePlayAgainButton();

  // re-generate colors
  initColors();
}

// main
(() => {
  initColors();

  attachEventForColorList();

  attachEventForPlayAgainButton();
})();