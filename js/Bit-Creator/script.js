const bitElements = document.querySelector('#bits');
const timer = document.querySelector('#timer');
const numberElement = document.querySelector('#number');
const resetButton = document.querySelector('#reset');
const bit3Button = document.querySelector('#bit3');
const bit8Button = document.querySelector('#bit8');
const keysElement = document.querySelector('#keys');
const bitsNumberElement = document.querySelector('#bitNumber');
const practiceButton = document.querySelector('#practice');
const challengeButton = document.querySelector('#challenge');

let bits = 8

const keys = [
  'a',
  's',
  'd',
  'f',
  'j',
  'k',
  'l',
  ';',
];

let numbers = { 0: 1 };
let state = Array(bits).fill(0)
let sec = 0;
let interval;
let practice = false;

const writeState = () => {
  let html = '';
  for (let bit = 0; bit < bits; bit++) {
    html += `<span class="bit-number ${state[bit] ? 'on' : 'off'}">${state[bit]}</span>`;
    if (bit === 3) {
      html+=`<span class="bit-number"></span>`
    }
  }

  html += `<div>You've generated ${Object.keys(numbers).length} unique numbers</div>`

  const decimal = parseInt(state.join(''), 2);
  numberElement.innerHTML = decimal;

  bitElements.innerHTML = html;
}

const writeTimer = () => {
  const minutes = parseInt(sec / 60) + '';
  const seconds = parseInt((sec % 60) * 100, 10) / 100 + '';
  const [secz, dec] = seconds.split('.')
  const s = `${minutes.padStart(2, '0')}:${secz.padStart(2, '0')}.${dec || 0}`;
  timer.innerHTML = `<div id="timer-numbers">${s}</div>`
}

const resetState = () => {
  numbers = { 0: 1 };
  state = Array(bits).fill(0);
  sec = 0;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

writeState();
writeTimer();

document.addEventListener('keypress', e => {
  const i = keys.slice(0, bits).findIndex(a => a === e.key);

  if (i === -1) {
    return;
  }

  const nums = Object.keys(numbers).length;

  if (nums === 1) {
    interval = setInterval(() => {
      sec += 0.01;
      writeTimer();
    }, 10)
  }

  state[i] = state[i] ? 0 : 1;
  console.log(state)
  const decimal = parseInt(state.join(''), 2);
  if (!practice && numbers[decimal]) {
    resetState();
    alert(`You lost!  You already have ${decimal}! You generated ${nums} unique numbers this round in ${sec} seconds`)
  } else {
    numbers[parseInt(state.join(''), 2)] = 1;
  }

  writeState();
  if (nums + 1 === 2**bits) {
    alert(`Yay, you win! Completed in ${sec} seconds`);
    clearInterval(interval);
  }
})

resetButton.addEventListener('click', () => {
  resetState();
  writeState();
  writeTimer();
})

bit3Button.addEventListener('click', () => {
  bits = 3;
  resetState();
  writeState();
  bit3Button.classList.add('selected');
  bit8Button.classList.remove('selected');
  const keysSlice = keys.slice(0, bits).map(k => k.toUpperCase());
  keysElement.innerHTML = keysSlice.slice(0, keysSlice.length - 1).map(k => k + ', ').join('') + 'and ' + keysSlice[keysSlice.length - 1];
  bitsNumberElement.innerHTML = bits;
})

bit8Button.addEventListener('click', () => {
  bits = 8;
  resetState();
  writeState();
  bit8Button.classList.add('selected');
  bit3Button.classList.remove('selected');
  const keysSlice = keys.slice(0, bits).map(k => k.toUpperCase());
  keysElement.innerHTML = keysSlice.slice(0, keysSlice.length - 1).map(k => k + ', ').join('') + 'and ' + keysSlice[keysSlice.length - 1];
  bitsNumberElement.innerHTML = bits;
})

practiceButton.addEventListener('click', () => {
  practice = true;
  resetState();
  writeState();
  practiceButton.classList.add('selected');
  challengeButton.classList.remove('selected');
})

challengeButton.addEventListener('click', () => {
  practice = false;
  resetState();
  writeState();
  challengeButton.classList.add('selected');
  practiceButton.classList.remove('selected');
})