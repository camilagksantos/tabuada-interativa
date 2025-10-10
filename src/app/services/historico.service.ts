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
}
