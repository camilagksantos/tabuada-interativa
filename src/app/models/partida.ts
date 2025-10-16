import { Questao } from "./questao";

export interface Partida {
    id: string;
    nomeJogador: string;
    data: string;
    tabuadas: number[];
    modoAleatorio: boolean;
    questoes: Questao[];
    corretos: number;
    incorretos: number;
    tempoTotalSegundos: number;
}
