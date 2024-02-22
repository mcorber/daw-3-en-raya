import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Marcador from './marcador';

class Tablero {
  #casillas;  // Este será el array de arrays donde guardaremos lo que hay en cada posición
  #dimension; // Esta variable determinará el tamaño del tablero
  #turno;     // En esta variable queda guardo a quien le toca, toma valores: X o O
  #elementID;
  #marcador;
  #maxRounds;
  #versusMachine;
  #endGame = false;
  #actions = []

  constructor(dimension = 3, versusMachine=false, maxrounds) {
    let tablero = document.getElementById('tablero');
    tablero.dataset.round = 0;
    this.#casillas = new Array();
    this.#dimension = dimension;
    this.#maxRounds = maxrounds;
    this.#versusMachine = versusMachine;
    for (let i = 0; i <this.#dimension; i++){
      this.#casillas[i] = new Array();
      for (let j = 0; j < this.#dimension; j++) {
        this.#casillas[i][j] = null;
      }
    }
    this.#turno = 'X';
    this.#marcador = new Marcador();

  }

  imprimirRondas(){
    let tablero = document.getElementById(this.#elementID);
    let currentRound = parseInt(tablero.dataset.round);
    let infoCurrentRound = document.querySelector('.roundsContainer h3');
    infoCurrentRound.textContent = `Ronda : ${parseInt(currentRound+1)} / ${this.#maxRounds}`;
  }

  imprimir(elementId='tablero') {
    
   
    this.#elementID = elementId;
    let tablero = document.getElementById(this.#elementID);
    tablero.innerHTML = '';
     this.imprimirRondas();
    for (let fila = 0; fila < this.#dimension; fila++){
      for (let columna = 0; columna < this.#dimension; columna++){
        let casilla = document.createElement('div');
        casilla.dataset.fila = fila;
        casilla.dataset.columna = columna;
        casilla.dataset.libre = '';
        if (this.#casillas[fila][columna]) {
          casilla.textContent = this.#casillas[fila][columna];
          casilla.dataset.libre = this.#casillas[fila][columna];
        }
        tablero.appendChild(casilla);
        this.addEventClick(casilla);
      }
    }
    tablero.style.gridTemplateColumns = `repeat(${this.#dimension}, 1fr)`;
    
  }

  isFree(fila, columna) {
    return true ? this.#casillas[fila][columna] === null : false;
  }

  setCasilla(fila, columna, valor) {
    if (this.isFree(fila, columna)) {
      this.#casillas[fila][columna] = valor;
      return true;
    }
    return false;
  }

  getCasilla(fila, columna) {
    return this.#casillas[fila][columna];
  }

  toogleTurno() {
    if (this.#endGame) return false;

    if (this.#turno === 'X') {
      this.#turno = 'O';
      //Comprobamos si jugamos contra la máquina
      if (this.#versusMachine) {
        let posicionLibre = this.getCasillaFreeRandom();
        this.setCasilla(posicionLibre.i, posicionLibre.j, 'O');
        this.imprimir();
        this.comprobarResultados()
        if (this.#endGame) return false;
        this.toogleTurno();
      }

    } else {
      this.#turno = 'X';
    }
  }

  comprobarResultados() {
    // Comprobamos filas
    let fila;
    let columna;
    let ganado = false;
    for (fila = 0; fila < this.#dimension && !ganado; fila++){
      let seguidas = 0;
      for (columna = 0; columna < this.#dimension; columna++){
        if (columna !== 0) {
          if (this.getCasilla(fila, columna) === this.getCasilla(fila, columna - 1)) {
            if (this.getCasilla(fila, columna) !== null) {
              seguidas++;
            }
          }
        }
      }
      if (seguidas === this.#dimension - 1) {
        console.log('Linea');
        ganado = true;
      }
    }

    // Comprobar columnas
    for (columna = 0; columna < this.#dimension && !ganado; columna++){
      let seguidas = 0;
      for (fila = 0; fila < this.#dimension; fila++){
        if (fila !== 0) {
          if (this.getCasilla(fila, columna) === this.getCasilla(fila-1, columna)) {
            if (this.getCasilla(fila, columna) !== null) {
              seguidas++;
            }
          }
        }
      }
      if (seguidas === this.#dimension - 1) {
        console.log('Columna');
        ganado = true;
      }
    }

    // Diagonal de izq a derecha
    let seguidas = 0;
    for (let i = 0; i < this.#dimension; i++){
      if (i !== 0) {
        if ((this.getCasilla(i, i) === this.getCasilla(i - 1, i - 1)) && this.getCasilla(i,i) !== null) {
          seguidas++;
        }
      }
    }

    if (seguidas === this.#dimension - 1) {
      console.log('Diagonal de izq a derecha');
      ganado = true;
    }

    // Diagonal de izq a derecha
    seguidas = 0;
    for (let i = this.#dimension-1; i >= 0; i--){
      if (i !== this.#dimension - 1) {
        let j = this.#dimension - 1 - i;
        if ((this.getCasilla(i, j) === this.getCasilla(i + 1, j - 1)) && this.getCasilla(i,j) !== null) {
          seguidas++;
        }
      }
    }

    if (seguidas === this.#dimension - 1) {
      console.log('Diagonal de derecha a izquierda');
      ganado = true;
    }

    if (ganado) {
      this.#endGame = true;
      Toastify({
        text: `Ha ganado el jugador ${this.#turno}`,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "blue",
        },
        onClick: function(){} // Callback after click
      }).showToast();

      let libres = document.querySelectorAll('div[data-libre=""]');
      libres.forEach((casillaLibre) => {
        casillaLibre.dataset.libre = '-';
      });

      this.#marcador.addPuntos(this.#turno);
      document.querySelector('.clearGame').classList.toggle('show');
      let tablero = document.getElementById(this.#elementID);
      let currentRound = parseInt(tablero.dataset.round);
      if((this.#maxRounds-1)===(currentRound)){
        tablero.classList.toggle('hide');
        let ganador = document.getElementById('ganador');
        ganador.classList.toggle('show');
        document.getElementById('actions').classList.toggle('show');
        ganador.querySelector('h1').textContent=`Fin del juego`;
        document.querySelector('.clearGameButton').classList.toggle('hide');
        document.querySelector('.clearGame').classList.toggle('show');
        if(this.#marcador.getFirstPlayerPoints() > this.#marcador.getSecondPlayerPoints()){
          ganador.querySelector('h3').textContent=`Ha ganado ${this.#marcador.getFirstPlayerName()} con ${this.#marcador.getFirstPlayerPoints()} puntos`;
          
        }else if(this.#marcador.getFirstPlayerPoints() < this.#marcador.getSecondPlayerPoints()){
          ganador.querySelector('h3').textContent=`Ha ganado ${this.#marcador.getSecondPlayerName()} con ${this.#marcador.getSecondPlayerPoints()} puntos`;
          
        }else{
          ganador.querySelector('h3').textContent='EMPATE'
        }
      }
    } else {
      // Si no se ha ganado hay que comprobar si el tablero está petao, si es así son tablas
      if (this.isFull()) {
        Toastify({
          text: `Han sido tablas`,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "blue",
          },
          onClick: function(){} // Callback after click
        }).showToast();
        document.querySelector('.clearGameButton').classList.toggle('hide');
        document.querySelector('.clearGame').classList.toggle('show');
        this.#endGame = true;
        if((this.#maxRounds-1)===(currentRound)){
          console.log("Fin del juego");
          document.querySelector('.clearGame').classList.toggle('show');
          debugger;
          if(this.#marcador.getFirstPlayerPoints() > this.#marcador.getSecondPlayerPoints()){
            
            console.log(`Ha ganado ${this.#marcador.getFirstPlayerName()} con ${this.#marcador.getFirstPlayerPoints()} puntos`);
          }else if(this.#marcador.getFirstPlayerPoints() < this.#marcador.getSecondPlayerPoints()){
            
            console.log(`Ha ganado ${this.#marcador.getSecondPlayerName()} con ${this.#marcador.getSecondPlayerPoints()} puntos`);
          }else{
            console.log("Empate");
          }
        }
      }
    }

  }

  isFull() {
    return !this.#casillas.some(fila => fila.some(casilla => casilla === null));
  }

  saveAction(fila,columna,turno){
    let nuevaAccion = {
      'fila': fila,
      'columna':columna,
      'turno' : turno
    }

    this.#actions.push(nuevaAccion);
  }

  clearActions(){
    let actions = document.getElementById('actions');
    actions.innerHTML = "";
    this.#actions.splice(0,this.#actions.length);
    this.showAction()
  }

  showAction() {
    let actions = document.getElementById('actions');
    actions.innerHTML = "";
    this.#actions.map(action => {
        let newLi = document.createElement('li');
        newLi.textContent = `El jugador ${action.turno} ha movido ficha en fila: ${action.fila}, columna: ${action.columna}`;
        actions.appendChild(newLi);
    });
}


  addEventClick(casilla) {
    casilla.addEventListener('click', (e) => {
      let casillaSeleccionada = e.currentTarget;
      if (casillaSeleccionada.dataset.libre === '') {
        casillaSeleccionada.textContent = this.#turno;
        this.setCasilla(
          casillaSeleccionada.dataset.fila,
          casillaSeleccionada.dataset.columna,
          this.#turno
        )
        this.saveAction(
          casillaSeleccionada.dataset.fila,
          casillaSeleccionada.dataset.columna,
          this.#turno
        )
        this.showAction();
        this
        casillaSeleccionada.dataset.libre = this.#turno;
        this.comprobarResultados();
        this.toogleTurno();
      }
    });

    casilla.addEventListener('mouseover', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = this.#turno;
      }
    });

    casilla.addEventListener('mouseleave', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = '';
      }
    })
  }

  get dimension() {
    return this.#dimension;
  }

  get elementID() {
    return this.#elementID;
  }

  limpiar() {
    let tablero = document.getElementById(this.#elementID);
    let currentRound = parseInt(tablero.dataset.round);
    tablero.dataset.round = currentRound + parseInt(1);
    this.#casillas = this.#casillas.map(casilla => casilla.map(c => null));
    this.#endGame = false;
    
    this.imprimir();
    this.imprimirRondas();
    this.clearActions()
    document.querySelector('.clearGame').classList.toggle('show');
  }

  getCasillaFreeRandom() {
    let i, j;
    do {
      i = Math.floor(Math.random() * (this.#dimension));
      j = Math.floor(Math.random() * (this.#dimension));
    } while (!this.isFree(i, j))
    return {
      i: i,
      j: j
    }
  }
}

export default Tablero;
