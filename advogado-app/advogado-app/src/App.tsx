// src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvogadoForm from './components/AdvogadoForm';
import AdvogadoList from './components/AdvogadoList';
import './styles/App.css';
import { Advogado, AdvogadoFormData } from '../src/types/Types';  // Importar os tipos Advogado e AdvogadoFormData

const App: React.FC = () => {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdvogados();
  }, []);

  const fetchAdvogados = async () => {
    const response = await axios.get('/api/advogados');
    setAdvogados(response.data);
  };

  const handleFormSubmit = async (data: AdvogadoFormData) => {
    if (editingId !== null) {
      await axios.put(`/api/advogados/${editingId}`, { ...data, id: editingId });
    } else {
      await axios.post('/api/advogados', data);
    }
    fetchAdvogados();
    setEditingId(null);
  };

  const handleEdit = (advogado: Advogado) => {
    setEditingId(advogado.id || null);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/advogados/${id}`);
    fetchAdvogados();
  };

  return (
    <div className="App">
      <h1>Gerenciar Advogados</h1>
      <AdvogadoForm
        onSubmit={handleFormSubmit}
        editingId={editingId}
        setEditingId={setEditingId}
      />
      <AdvogadoList
        advogados={advogados}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default App;
