import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-feedback',
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  @Input() corretos: number = 0;
  @Input() incorretos: number = 0;
  @Input() totalQuestoes: number = 10;
  @Input() mensagem: string = '';
  @Input() mensagemCor: string = '#4CAF50';

  @Output() reiniciar = new EventEmitter<void>();
  @Output() voltarHome = new EventEmitter<void>();

  get percentual(): number {
    return Math.round((this.corretos / this.totalQuestoes) * 100);
  }

  onReiniciar() {
    this.reiniciar.emit();
  }

  onVoltarHome() {
    this.voltarHome.emit();
  }
}
