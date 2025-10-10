import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistoricoService } from '../../services/historico.service';
import { Partida } from '../../models/partida';

@Component({
  selector: 'app-historico',
  imports: [CommonModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss'
})
export class HistoricoComponent {
  partidas: Partida[] = [];

  constructor(
    private historicoService: HistoricoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarHistorico();
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
    }
  }

  limparTudo(): void {
    if (confirm('Deseja realmente limpar TODO o histórico?')) {
      this.historicoService.limparHistorico();
      this.carregarHistorico();
    }
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }
}
