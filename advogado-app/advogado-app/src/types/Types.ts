export interface Advogado {
    Id: number;
    Nome: string;
    Senioridade: string;
    Logradouro: string;
    Bairro: string;
    Estado: string;
    Cep: string;
    Numero: string;
}
    

export type AdvogadoFormData = Omit<Advogado, 'Id'>;
    