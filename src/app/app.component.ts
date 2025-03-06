import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  tabuadas: { value: string, label: string }[] = [
    { value: '1', label: 'Tabuada do 1' },
    { value: '2', label: 'Tabuada do 2' },
    { value: '3', label: 'Tabuada do 3' },
    { value: '4', label: 'Tabuada do 4' },
    { value: '5', label: 'Tabuada do 5' },
    { value: '6', label: 'Tabuada do 6' },
    { value: '7', label: 'Tabuada do 7' },
    { value: '8', label: 'Tabuada do 8' },
    { value: '9', label: 'Tabuada do 9' },
    { value: '10', label: 'Tabuada do 10' },
    { value: 'aleatorio', label: 'Aleatório' }
  ];

  tabuadaSelecionada: string = '1';
  numeroAtual: number = 0;
  multiplicadorAtual: number = 0;
  respostas: number[] = [];
  respostaCorreta: number = 0;

  acertos: number = 0;
  erros: number = 0;
  questoesConcluidas: number = 0;
  totalQuestoes: number = 10;

  jogoIniciado: boolean = false;
  jogoFinalizado: boolean = false;
  mensagem: string = 'Escolha uma tabuada e clique em Iniciar';
  mensagemCor: string = 'black';

  botaoClicado: number | null = null;
  botaoCorreto: number | null = null;
  botoesDesabilitados: boolean = false;

  iniciarJogo(): void {
    this.tabuadaSelecionada = this.tabuadaSelecionada;
    this.acertos = 0;
    this.erros = 0;
    this.questoesConcluidas = 0;
    this.jogoIniciado = true;
    this.jogoFinalizado = false;
    this.mensagem = '';
    this.proximaQuestao();
  }

  reiniciarJogo(): void {
    this.iniciarJogo();
  }

  voltarAoInicio(): void {
    this.jogoIniciado = false;
    this.jogoFinalizado = false;
    this.mensagem = 'Escolha uma tabuada e clique em Iniciar';
  }

  proximaQuestao(): void {
    this.botaoClicado = null;
    this.botaoCorreto = null;
    this.botoesDesabilitados = false;
    this.mensagem = '';

    if (this.questoesConcluidas >= this.totalQuestoes) {
      this.finalizarJogo();
      return;
    }

    if (this.tabuadaSelecionada === 'aleatorio') {
      this.numeroAtual = Math.floor(Math.random() * 10) + 1;
    } else {
      this.numeroAtual = parseInt(this.tabuadaSelecionada);
    }

    this.multiplicadorAtual = Math.floor(Math.random() * 10) + 1;
    this.respostaCorreta = this.numeroAtual * this.multiplicadorAtual;
    this.respostas = this.gerarRespostas(this.respostaCorreta);
  }

  gerarRespostas(respostaCorreta: number): number[] {
    const respostas = [respostaCorreta];

    while (respostas.length < 10) {
      let novaResposta;
      if (Math.random() < 0.5) {
        // Gerar resposta próxima
        novaResposta = respostaCorreta + (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? 1 : -1);
      } else {
        // Gerar resposta aleatória
        novaResposta = Math.floor(Math.random() * 100) + 1;
      }

      if (novaResposta > 0 && !respostas.includes(novaResposta)) {
        respostas.push(novaResposta);
      }
    }

    // Embaralhar as respostas
    return respostas.sort(() => Math.random() - 0.5);
  }

  verificarResposta(resposta: number): void {
    if (this.botoesDesabilitados) return;

    this.botoesDesabilitados = true;
    this.botaoClicado = resposta;
    this.botaoCorreto = this.respostaCorreta;

    if (resposta === this.respostaCorreta) {
      this.mensagem = '✅ Correto!';
      this.mensagemCor = '#4CAF50';
      this.acertos++;
    } else {
      this.mensagem = '❌ Incorreto!';
      this.mensagemCor = '#f44336';
      this.erros++;
    }

    this.questoesConcluidas++;

    // Aguardar um pouco antes da próxima questão
    setTimeout(() => {
      this.proximaQuestao();
    }, 1500);
  }

  getClassBotao(resposta: number): string {
    if (this.botaoClicado === null) return '';

    if (resposta === this.respostaCorreta) {
      return 'correto';
    } else if (resposta === this.botaoClicado) {
      return 'incorreto';
    }

    return '';
  }

  getProgresso(): number {
    return (this.questoesConcluidas / this.totalQuestoes) * 100;
  }

  finalizarJogo(): void {
    this.jogoFinalizado = true;

    if (this.acertos >= this.totalQuestoes * 0.7) {
      this.mensagem = '🎉 PARABÉNS! Você completou a tabuada com sucesso!';
      this.mensagemCor = '#4CAF50';
    } else {
      this.mensagem = 'Continue praticando!';
      this.mensagemCor = '#ff9800';
    }
  }
}