import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorBackground, getColorElementList, getColorListElement, getInActiveColorList, getPlayAgainButton, getTimerElement } from './selectors.js';
import { createTimer, getRandomColorPairs, hidePlayAgainButton, setTimerText, showPlayAgainButton } from './utils.js';

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(second) {
  // show timer text
  const fullSecond = `0${second}`.slice(-2);
  setTimerText(fullSecond);
}

function handleTimerFinish() {
  // end game
  gameStatus = GAME_STATUS.FINISHED;
  setTimerText('Game Over!')
  showPlayAgainButton();
}

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

      // stop game if you win
      timer.clear();

      gameStatus = GAME_STATUS.FINISHED;
    }

    // change background when matching
    const bgColor = getColorBackground();
    bgColor.style.backgroundColor = selections[0].dataset.color;

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

    // race-condition check with handleFinish
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING;
    }
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

  // reset background
  const bgColor = getColorBackground();
  bgColor.style.backgroundColor = '';
  
  // start new game
  startTimer();
}

function startTimer() {
 timer.start();
}

// main
(() => {
  initColors();

  attachEventForColorList();

  attachEventForPlayAgainButton();

  startTimer();
})();