import { GAME_STATUS, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getColorListElement } from './selectors.js';
import { getRandomColorPairs } from './utils.js';

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

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
    const overlayElement = liElement.querySelector('.overlay');
    overlayElement.style.background = colorList[index];
  });
}

function handleColorClick(liElement) {
  if(!liElement) return;
  liElement.classList.add('active');
}

function attachEventForColorList() {
  const ulElement = getColorListElement();
  if (!ulElement) return;
  // add event for li from ul through event delegate technic
  ulElement.addEventListener('click', (event) => {
    handleColorClick(event.target);
  });
}

// main
(() => {
  initColors();

  attachEventForColorList();
})();