// src/components/AdvogadoList.tsx
import React from 'react';
import { Advogado } from '../types/Types';  

interface AdvogadoListProps {
    advogados: Advogado[];
    handleEdit: (advogado: Advogado) => void;
    handleDelete: (id: number) => void;
}

const AdvogadoList: React.FC<AdvogadoListProps> = ({ advogados, handleEdit, handleDelete }) => {
    return (
        <ul>
            {advogados.map((advogado) => (
                <li key={advogado.id}>
                    {advogado.nome} - {advogado.senioridade}
                    <button onClick={() => handleEdit(advogado)}>Editar</button>
                    <button onClick={() => handleDelete(advogado.id)}>Excluir</button>
                </li>
            ))}
        </ul>
    );
};

export default AdvogadoList;
