import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { FeedbackComponent } from '../feedback/feedback.component';


@Component({
  selector: 'app-game-component',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedbackComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  nomeJogador: string = '';
  tabuadasDisponiveis: number[] = [];
  modoAleatorio: boolean = false;

  numeroAtual: number = 0;
  multiplicadorAtual: number = 0;
  respostaUsuario: string = '';
  respostaCorreta: number = 0;

  acertos: number = 0;
  erros: number = 0;
  questoesConcluidas: number = 0;
  totalQuestoes: number = 10;
  mensagem: string = '';
  mensagemCor: string = 'black';

  jogoIniciado: boolean = false;
  jogoFinalizado: boolean = false;

  botoesDesabilitados: boolean = false;

  questoesGeradas: Set<string> = new Set();

  constructor(
    private router: Router,
    private gameState: GameStateService
  ) { }

  ngOnInit(): void {
    const dados = this.gameState.getDadosJogo();

    if (dados.tabuadasSelecionadas.length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.nomeJogador = dados.nomeJogador;
    this.tabuadasDisponiveis = dados.tabuadasSelecionadas;
    this.modoAleatorio = dados.modoAleatorio;

    this.iniciarJogo();
  }

  iniciarJogo(): void {
    this.acertos = 0;
    this.erros = 0;
    this.questoesConcluidas = 0;
    this.jogoIniciado = true;
    this.jogoFinalizado = false;
    this.mensagem = '';
    this.questoesGeradas = new Set();
    this.proximaQuestao();
  }

  reiniciarJogo(): void {
    this.iniciarJogo();
  }

  voltarAoInicio(): void {
    this.gameState.limparDados();
    this.router.navigate(['/home']);
  }

  proximaQuestao(): void {
    this.respostaUsuario = '';
    this.botoesDesabilitados = false;
    this.mensagem = '';

    if (this.questoesConcluidas >= this.totalQuestoes) {
      this.finalizarJogo();
      return;
    }

    let tentativas = 0;
    const maxTentativas = 100;

    do {
      if (this.modoAleatorio) {
        // MODO ALEATÓRIO: sorteia tabuada E multiplicador
        const indiceAleatorio = Math.floor(Math.random() * this.tabuadasDisponiveis.length);
        this.numeroAtual = this.tabuadasDisponiveis[indiceAleatorio];
        this.multiplicadorAtual = Math.floor(Math.random() * 10) + 1;
      } else {
        // MODO SEQUENCIAL: tabuada em sequência, multiplicador de 1 a 10
        const indice = this.questoesConcluidas % this.tabuadasDisponiveis.length;
        this.numeroAtual = this.tabuadasDisponiveis[indice];
        this.multiplicadorAtual = (this.questoesConcluidas % 10) + 1;
      }

      this.respostaCorreta = this.numeroAtual * this.multiplicadorAtual;

      const questaoKey = `${this.numeroAtual}x${this.multiplicadorAtual}`;

      if (!this.questoesGeradas.has(questaoKey)) {
        this.questoesGeradas.add(questaoKey);
        break;
      }

      tentativas++;
    } while (tentativas < maxTentativas);
  }

  adicionarNumero(numero: number): void {
    if (this.botoesDesabilitados) return;
    if (this.respostaUsuario.length < 3) {
      this.respostaUsuario += numero.toString();
    }
  }

  apagarUltimo(): void {
    if (this.botoesDesabilitados) return;
    this.respostaUsuario = this.respostaUsuario.slice(0, -1);
  }

  limparResposta(): void {
    if (this.botoesDesabilitados) return;
    this.respostaUsuario = '';
  }

  verificarResposta(): void {
    if (this.botoesDesabilitados || this.respostaUsuario === '') return;

    this.botoesDesabilitados = true;
    const respostaNumerica = parseInt(this.respostaUsuario);

    if (respostaNumerica === this.respostaCorreta) {
      this.acertos++;
    } else {
      this.erros++;
    }

    this.questoesConcluidas++;
    this.proximaQuestao();
  }

  getProgresso(): number {
    return (this.questoesConcluidas / this.totalQuestoes) * 100;
  }

  finalizarJogo(): void {
    this.jogoFinalizado = true;

    if (this.acertos >= this.totalQuestoes * 0.7) {
      this.mensagem = `🎉 PARABÉNS ${this.nomeJogador.toUpperCase()}! Você acertou ${this.acertos} de ${this.totalQuestoes} questões!`;
      this.mensagemCor = '#4CAF50';
    } else {
      this.mensagem = `${this.nomeJogador}, você acertou ${this.acertos} de ${this.totalQuestoes}. Continue praticando!`;
      this.mensagemCor = '#ff9800';
    }
  }
}
