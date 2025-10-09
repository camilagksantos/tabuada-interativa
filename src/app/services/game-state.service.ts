import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  nomeJogador: string = '';
  tabuadasSelecionadas: number[] = [];
  modoAleatorio: boolean = false;

  setDadosJogo(nome: string, tabuadas: number[], aleatorio: boolean) {
    this.nomeJogador = nome;
    this.tabuadasSelecionadas = tabuadas;
    this.modoAleatorio = aleatorio;
  }

  getDadosJogo() {
    return {
      nomeJogador: this.nomeJogador,
      tabuadasSelecionadas: this.tabuadasSelecionadas,
      modoAleatorio: this.modoAleatorio
    };
  }

  limparDados() {
    this.nomeJogador = '';
    this.tabuadasSelecionadas = [];
    this.modoAleatorio = false;
  }
}
