import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  nomeJogador: string = '';
  modoAleatorio: boolean = false;

  tabuadas = [
    { numero: 1, selecionada: false },
    { numero: 2, selecionada: false },
    { numero: 3, selecionada: false },
    { numero: 4, selecionada: false },
    { numero: 5, selecionada: false },
    { numero: 6, selecionada: false },
    { numero: 7, selecionada: false },
    { numero: 8, selecionada: false },
    { numero: 9, selecionada: false },
    { numero: 10, selecionada: false }
  ];

  constructor(
    private router: Router,
    private gameState: GameStateService
  ) { }

  get tabuadasSelecionadas(): number[] {
    return this.tabuadas
      .filter(t => t.selecionada)
      .map(t => t.numero);
  }

  get podeIniciar(): boolean {
    return this.nomeJogador.trim().length > 0 &&
      this.tabuadasSelecionadas.length > 0;
  }

  get todasSelecionadas(): boolean {
    return this.tabuadas.every(t => t.selecionada);
  }

  get textoBotaoSelecionar(): string {
    return this.todasSelecionadas ? 'Desmarcar Todas' : 'Selecionar Todas';
  }

  get textoBotaoIniciar(): string {
    return this.podeIniciar ? '🚀 Começar a Jogar!' : '⚠️ Preencha os dados acima';
  }

  iniciarJogo() {
    if (this.podeIniciar) {
      this.gameState.setDadosJogo(
        this.nomeJogador.trim(),
        this.tabuadasSelecionadas,
        this.modoAleatorio
      );
      this.router.navigate(['/game']);
    }
  }

  selecionarTodas() {
    const todasSelecionadas = this.todasSelecionadas;
    this.tabuadas.forEach(t => t.selecionada = !todasSelecionadas);
  }
}
