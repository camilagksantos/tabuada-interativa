import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistoricoService } from '../../services/historico.service';
import { Partida } from '../../models/partida';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historico',
  imports: [CommonModule, FormsModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss'
})
export class HistoricoComponent {
  partidas: Partida[] = [];

  abaAtiva: 'resumo' | 'partidas' | 'stats' = 'resumo';
  periodoSelecionado: number = 30; // dias
  jogadorSelecionado: string = ''; // vazio = todos
  listaJogadores: string[] = [];

  // Dados calculados
  estatisticasGerais: any = null;
  estatisticasJogador: any = null;
  partidasFiltradas: Partida[] = [];
  partidasAgrupadasPorJogador: Map<string, Partida[]> = new Map();

  constructor(
    public historicoService: HistoricoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarHistorico();
    this.atualizarDados();
  }

  carregarHistorico(): void {
    this.partidas = this.historicoService.obterHistorico();
    this.partidas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatarTempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}min ${segs}s`;
  }

  deletarPartida(id: string): void {
    if (confirm('Deseja realmente deletar esta partida?')) {
      this.historicoService.deletarPartida(id);
      this.carregarHistorico();
      this.atualizarDados();
    }
  }

  limparTudo(): void {
    if (confirm('Deseja realmente limpar TODO o histórico?')) {
      this.historicoService.limparHistorico();
      this.carregarHistorico();
      this.atualizarDados();
    }
  }

  // 🆕 MÉTODOS PARA FILTROS E ESTATÍSTICAS

  atualizarDados(): void {
    this.listaJogadores = this.historicoService.getJogadoresUnicos();
    this.aplicarFiltros();
    this.calcularEstatisticas();
    this.agruparPartidas();
  }

  aplicarFiltros(): void {
    let partidas = this.historicoService.obterHistorico();

    // Filtro por período
    if (this.periodoSelecionado > 0) {
      partidas = this.historicoService.getPartidasPorPeriodo(this.periodoSelecionado);
    }

    // Filtro por jogador
    if (this.jogadorSelecionado) {
      partidas = partidas.filter(p =>
        p.nomeJogador.toLowerCase().trim() === this.jogadorSelecionado.toLowerCase().trim()
      );
    }

    // Ordena por data (mais recente primeiro)
    this.partidasFiltradas = partidas.sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  calcularEstatisticas(): void {
    // Estatísticas gerais
    this.estatisticasGerais = this.historicoService.getEstatisticasGerais(
      this.periodoSelecionado > 0 ? this.periodoSelecionado : undefined
    );

    // Estatísticas do jogador selecionado
    if (this.jogadorSelecionado) {
      this.estatisticasJogador = this.historicoService.getEstatisticasPorJogador(
        this.jogadorSelecionado
      );
    } else {
      this.estatisticasJogador = null;
    }
  }

  agruparPartidas(): void {
    this.partidasAgrupadasPorJogador.clear();

    this.partidasFiltradas.forEach(partida => {
      const nomeNormalizado = partida.nomeJogador.toLowerCase().trim();

      if (!this.partidasAgrupadasPorJogador.has(nomeNormalizado)) {
        this.partidasAgrupadasPorJogador.set(nomeNormalizado, []);
      }

      this.partidasAgrupadasPorJogador.get(nomeNormalizado)!.push(partida);
    });
  }

  onFiltroChange(): void {
    this.atualizarDados();
  }

  mudarAba(aba: 'resumo' | 'partidas' | 'stats'): void {
    this.abaAtiva = aba;
  }

  getJogadoresAgrupados(): Array<{ nome: string, partidas: Partida[] }> {
    return Array.from(this.partidasAgrupadasPorJogador.entries())
      .map(([nome, partidas]) => ({
        nome: partidas[0].nomeJogador, // Nome original (com maiúsculas)
        partidas
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  formatarDataRelativa(dataISO: string): string {
    const data = new Date(dataISO);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    if (data.toDateString() === hoje.toDateString()) {
      return 'Hoje';
    } else if (data.toDateString() === ontem.toDateString()) {
      return 'Ontem';
    } else {
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  getCorTaxaAcerto(taxa: number): string {
    if (taxa >= 80) return '#4CAF50'; // Verde
    if (taxa >= 60) return '#ff9800'; // Laranja
    return '#f44336'; // Vermelho
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }
}
