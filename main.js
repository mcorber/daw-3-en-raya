import Tablero from './tablero';
import './style.scss';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const buttonCreateTable = document.getElementById('createTable');
const inputDimensions = document.getElementById('dimension');
const inputRounds = document.getElementById('rounds');
const resetButton = document.getElementById('resetGame');
const clearGameContainer = document.querySelector('.clearGame');
const roundsContainer = document.querySelector('.roundsContainer');
const clearButtons = document.querySelectorAll('.clearGameButton');
const preGame = document.querySelector('.preGame');
const inGame = document.querySelector('.inGame');
const actions = document.getElementById('actions');
const ganador = document.getElementById('ganador')
let tablero;

buttonCreateTable.addEventListener('click', (e) => {
  if (!inputDimensions.value || inputDimensions.value<1) {
    Toastify({
      text: "Debe indicar una dimensión válida",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();

    inputDimensions.classList.add('error');
    inputDimensions.focus();
    return false;
  }

  if (!inputRounds.value || inputRounds.value<1) {
    Toastify({
      text: "Debe indicar una cantidad de rondas válida",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();

    inputRounds.classList.add('error');
    inputRounds.focus();
    return false;
  }

  

  let maxRounds = parseInt(inputRounds.value);

  

  let checkMachine = document.getElementById('machine');
  
    tablero = new Tablero(parseInt(inputDimensions.value),checkMachine.checked,maxRounds);
    tablero.imprimir('tablero');
    roundsContainer.classList.toggle('show');
    preGame.classList.toggle('hide');
    inGame.classList.toggle('hide');
    actions.classList.toggle('show');
  
});

inputDimensions.addEventListener('keydown', () => {
  inputDimensions.classList.remove('error');
});

for (let button of clearButtons) {
  button.addEventListener('click', () => {
    tablero.limpiar();
  });
}

resetButton.addEventListener('click', (e) => {
  document.getElementById(tablero.elementID).innerHTML = '';
  document.getElementById(tablero.elementID).dataset.round = 0;
  document.getElementById('marcador').innerHTML = '';

  tablero = null;
  
  preGame.classList.toggle('hide');
  roundsContainer.classList.toggle('show');
  inGame.classList.toggle('hide');
  ganador.classList.toggle('show');
  document.querySelector('.clearGameButton').classList.toggle('hide');
  let clases = document.querySelector('.clearGame').classList;
  for(let i = 0; i<clases.length;i++){
    if(clases[i]==='show'){
      document.querySelector('.clearGame').classList.toggle('show');
    }
  }
  tablero.clearActions();
  inputDimensions.innerHTML = '';
  inputRounds.innerHTML='';
  inputDimensions.focus();
});
