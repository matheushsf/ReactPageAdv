export interface Advogado {
    id: number;
    nome: string;
    senioridade: string;
    logradouro: string;
    bairro: string;
    estado: string;
    cep: string;
    numero: string;
}
    

export type AdvogadoFormData = Omit<Advogado, 'id'>;
    