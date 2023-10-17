import { getPlayAgainButton, getTimerElement } from "./selectors.js";

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <=2) return arr;

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);
    
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    // [arr[j], arr[i]] = [arr[i], arr[j]];
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = [];
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

  // random 'count' color
  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      // randomColor function is provided by https://github.com/davidmerfield/randomColor
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
   });

   colorList.push(color);
  }

  const fullColorList =  [...colorList, ...colorList];

  // shuffle list
  shuffle(fullColorList);

  return fullColorList;
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  playAgainButton.classList.add('show');
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  playAgainButton.classList.remove('show');
}

export function setTimerText(text) {
  const timerElement = getTimerElement();
  timerElement.textContent = text;
}

// using closure
export function createTimer({seconds, onChange, onFinish}) {
  let intervalId = null;

  function start() {
    // clear for sure before start
    clear();

    let currentSecond = seconds;
    intervalId = setInterval(() => {
      // if (onChange) onChange(currentSecond);
      onChange?.(currentSecond);

      currentSecond--;
      if (currentSecond < 0) {
        clear();
        onFinish?.();
      }
    }, 1000);
  }

  function clear() {
    clearInterval(intervalId);
  }

  return {
    start,
    clear,
  }
}