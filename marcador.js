class Marcador {
  #elementId;
  #jugadores = [
    {
      name: 'X',
      puntos: 0,
    },

    {
      name: 'O',
      puntos: 0,
    }
  ]

  constructor(elementId='marcador') {
    this.#elementId = elementId;
    this.imprimir();
  }

  addPuntos(name) {
    let jugador = this.#jugadores.find(j => j.name === name);
    jugador.puntos++;
    this.imprimir();
  }

  imprimir() {
    let marcadorFrontend = document.getElementById(this.#elementId);
    let ul = document.createElement('ul');
    this.#jugadores.forEach(jugador => {
      let li = document.createElement('li');
      li.textContent = `Jugador ${jugador.name} tiene ${jugador.puntos} puntos`;
      ul.append(li);
    });
    marcadorFrontend.innerHTML = '';
    marcadorFrontend.append(ul);
  }

  getFirstPlayerPoints(){
    return this.#jugadores[0].puntos;
  }
  getSecondPlayerPoints(){
    return this.#jugadores[1].puntos;
  }
  getFirstPlayerName(){
    return this.#jugadores[0].name;
  }
  getSecondPlayerName(){
    return this.#jugadores[1].name;
  }
}

export default Marcador;
