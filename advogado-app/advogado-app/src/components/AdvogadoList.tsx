// src/components/AdvogadoList.tsx
import React from 'react';
import { Advogado } from '../types/Types';  
import { getSeniorityLabel } from '../types/Seniority';

interface AdvogadoListProps {
    advogados: Advogado[];
    handleEdit: (advogado: Advogado) => void;
    handleDelete: (id: number) => void;
}

const AdvogadoList: React.FC<AdvogadoListProps> = ({ advogados, handleEdit, handleDelete }) => {
    console.log(advogados.map(x => x))
    return (
        <ul>
            {advogados.map((advogado) => (
                <li key={advogado.Id}>
                     {advogado.Nome} - {getSeniorityLabel(Number(advogado.Senioridade))}
                    <button onClick={() => handleEdit(advogado)}>Editar</button>
                    <button onClick={() => handleDelete(advogado.Id)}>Excluir</button>
                </li>
            ))}
        </ul>
    );
};

export default AdvogadoList;
