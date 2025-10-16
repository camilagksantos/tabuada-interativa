import { Injectable } from '@angular/core';
import { Partida } from '../models/partida';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  private readonly STORAGE_KEY = 'tabuada_historico';

  constructor() { }

  // Salva uma nova partida
  salvarPartida(partida: Partida): void {
    const historico = this.obterHistorico();
    historico.push(partida);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historico));
  }

  // Recupera todas as partidas
  obterHistorico(): Partida[] {
    const dados = localStorage.getItem(this.STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  // Limpa todo o histórico
  limparHistorico(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Deleta uma partida específica por ID
  deletarPartida(id: string): void {
    const historico = this.obterHistorico();
    const novoHistorico = historico.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(novoHistorico));
  }

  // 🆕 NOVOS MÉTODOS PARA ESTATÍSTICAS

  // Retorna lista de jogadores únicos (case-insensitive)
  getJogadoresUnicos(): string[] {
    const historico = this.obterHistorico();
    const jogadoresSet = new Set<string>();

    historico.forEach(partida => {
      jogadoresSet.add(partida.nomeJogador.toLowerCase().trim());
    });

    return Array.from(jogadoresSet).sort();
  }

  // Filtra partidas por jogador (case-insensitive)
  getPartidasPorJogador(nome: string): Partida[] {
    const historico = this.obterHistorico();
    const nomeLower = nome.toLowerCase().trim();

    return historico.filter(p =>
      p.nomeJogador.toLowerCase().trim() === nomeLower
    );
  }

  // Filtra partidas dos últimos X dias
  getPartidasPorPeriodo(dias: number): Partida[] {
    const historico = this.obterHistorico();
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return historico.filter(p =>
      new Date(p.data) >= dataLimite
    );
  }

  // Estatísticas gerais (com filtro opcional de período)
  getEstatisticasGerais(dias?: number): {
    totalPartidas: number;
    taxaAcertoMedia: number;
    tempoMedioPorQuestao: number;
    tabuadasMaisPraticadas: Array<{ tabuada: number, vezes: number }>;
  } {
    const partidas = dias ? this.getPartidasPorPeriodo(dias) : this.obterHistorico();

    if (partidas.length === 0) {
      return {
        totalPartidas: 0,
        taxaAcertoMedia: 0,
        tempoMedioPorQuestao: 0,
        tabuadasMaisPraticadas: []
      };
    }

    // Total de questões corretas/incorretas
    const totalCorretos = partidas.reduce((sum, p) => sum + p.corretos, 0);
    const totalIncorretos = partidas.reduce((sum, p) => sum + p.incorretos, 0);
    const totalQuestoes = totalCorretos + totalIncorretos;

    // Taxa média de acerto
    const taxaAcertoMedia = totalQuestoes > 0
      ? (totalCorretos / totalQuestoes) * 100
      : 0;

    // Tempo médio por questão
    const tempoTotal = partidas.reduce((sum, p) => sum + p.tempoTotalSegundos, 0);
    const tempoMedioPorQuestao = totalQuestoes > 0
      ? tempoTotal / totalQuestoes
      : 0;

    // Tabuadas mais praticadas
    const tabuadasMap = new Map<number, number>();
    partidas.forEach(p => {
      p.tabuadas.forEach(tab => {
        tabuadasMap.set(tab, (tabuadasMap.get(tab) || 0) + 1);
      });
    });

    const tabuadasMaisPraticadas = Array.from(tabuadasMap.entries())
      .map(([tabuada, vezes]) => ({ tabuada, vezes }))
      .sort((a, b) => b.vezes - a.vezes)
      .slice(0, 3);

    return {
      totalPartidas: partidas.length,
      taxaAcertoMedia: Math.round(taxaAcertoMedia),
      tempoMedioPorQuestao: Math.round(tempoMedioPorQuestao),
      tabuadasMaisPraticadas
    };
  }

  // Estatísticas detalhadas por jogador
  getEstatisticasPorJogador(nome: string): {
    totalPartidas: number;
    taxaAcerto: number;
    melhorResultado: number;
    tabuadasPraticadas: Array<{ tabuada: number, vezes: number, taxaAcerto: number }>;
    questoesDificeis: Array<{ pergunta: string, taxaAcerto: number }>;
  } {
    const partidas = this.getPartidasPorJogador(nome);

    if (partidas.length === 0) {
      return {
        totalPartidas: 0,
        taxaAcerto: 0,
        melhorResultado: 0,
        tabuadasPraticadas: [],
        questoesDificeis: []
      };
    }

    // Total de corretos/incorretos
    const totalCorretos = partidas.reduce((sum, p) => sum + p.corretos, 0);
    const totalIncorretos = partidas.reduce((sum, p) => sum + p.incorretos, 0);
    const totalQuestoes = totalCorretos + totalIncorretos;

    const taxaAcerto = totalQuestoes > 0
      ? Math.round((totalCorretos / totalQuestoes) * 100)
      : 0;

    // Melhor resultado
    const melhorResultado = Math.max(...partidas.map(p =>
      Math.round((p.corretos / (p.corretos + p.incorretos)) * 100)
    ));

    // Análise por tabuada
    const tabuadasMap = new Map<number, { corretos: number, incorretos: number }>();

    partidas.forEach(partida => {
      partida.tabuadas.forEach(tab => {
        const stats = tabuadasMap.get(tab) || { corretos: 0, incorretos: 0 };

        // Conta questões dessa tabuada específica
        partida.questoes.forEach(q => {
          const [num1] = q.pergunta.split(' × ').map(n => parseInt(n));
          if (num1 === tab) {
            if (q.correta) stats.corretos++;
            else stats.incorretos++;
          }
        });

        tabuadasMap.set(tab, stats);
      });
    });

    const tabuadasPraticadas = Array.from(tabuadasMap.entries())
      .map(([tabuada, stats]) => {
        const total = stats.corretos + stats.incorretos;
        return {
          tabuada,
          vezes: total,
          taxaAcerto: total > 0 ? Math.round((stats.corretos / total) * 100) : 0
        };
      })
      .sort((a, b) => b.vezes - a.vezes);

    // Questões mais difíceis (menor taxa de acerto)
    const questoesMap = new Map<string, { corretos: number, incorretos: number }>();

    partidas.forEach(partida => {
      partida.questoes.forEach(q => {
        const stats = questoesMap.get(q.pergunta) || { corretos: 0, incorretos: 0 };
        if (q.correta) stats.corretos++;
        else stats.incorretos++;
        questoesMap.set(q.pergunta, stats);
      });
    });

    const questoesDificeis = Array.from(questoesMap.entries())
      .map(([pergunta, stats]) => {
        const total = stats.corretos + stats.incorretos;
        return {
          pergunta,
          taxaAcerto: total > 0 ? Math.round((stats.corretos / total) * 100) : 0
        };
      })
      .filter(q => q.taxaAcerto < 80) // Só mostra se < 80%
      .sort((a, b) => a.taxaAcerto - b.taxaAcerto)
      .slice(0, 5);

    return {
      totalPartidas: partidas.length,
      taxaAcerto,
      melhorResultado,
      tabuadasPraticadas,
      questoesDificeis
    };
  }
}
