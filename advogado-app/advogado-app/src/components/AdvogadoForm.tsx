import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { AdvogadoFormData } from '../types/Types'; // Importar o tipo AdvogadoFormData

interface AdvogadoFormProps {
  onSubmit: (data: AdvogadoFormData) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  user?: AdvogadoFormData;
}

const schema = yup.object().shape({
  Nome: yup.string().required('Nome é obrigatório'),
  Senioridade: yup.string().required('Senioridade é obrigatória'),
  Logradouro: yup.string().required('Logradouro é obrigatório'),
  Bairro: yup.string().required('Bairro é obrigatório'),
  Estado: yup.string().required('Estado é obrigatório'),
  Cep: yup.string().required('CEP é obrigatório').matches(/^\d{5}-\d{3}$/, 'CEP inválido'),
  Numero: yup.string().required('Número é obrigatório'),
});

const AdvogadoForm: React.FC<AdvogadoFormProps> = ({ onSubmit, editingId, setEditingId, user }) => {
    const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, control, formState: { errors }, reset } = useForm<AdvogadoFormData>({
    resolver: yupResolver(schema),
    defaultValues: user || {}
  });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); 
    const formattedCep = value.replace(/^(\d{5})(\d)/, '$1-$2'); 
    setValue('Cep', formattedCep); 

    if (value.length === 8) {
      try {
        const responseCep = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
        if (!responseCep.data.erro) {
          setValue('Logradouro', responseCep.data.logradouro);
          setValue('Bairro', responseCep.data.bairro);
          setValue('Estado', responseCep.data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do CEP:", error);
      }
    }
  };

  const submitHandler = async (data: AdvogadoFormData) => {
    try {
      if (loading) return;
      setLoading(true);
      if (!editingId) {
        const response = await axios.post('http://localhost:9000/api/advogados', data);
        console.log('Advogado cadastrado:', response.data);
      }
      onSubmit(data);
      reset();
      setEditingId(null);
    } catch (error) {
      console.error("Erro ao cadastrar advogado:", error);
    }finally {
        setLoading(false); // Garantir que o carregamento é desativado
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <input placeholder="Nome" {...register('Nome')} />
      <p>{errors.Nome?.message}</p>

      <select {...register('Senioridade')}>
        <option value="">Selecione a Senioridade</option>
        <option value="Junior">Junior</option>
        <option value="Pleno">Pleno</option>
        <option value="Senior">Senior</option>
      </select>
      <p>{errors.Senioridade?.message}</p>

      <Controller
        name="Cep"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            placeholder="CEP"
            onBlur={handleCepBlur}
          />
        )}
      />

      <input placeholder="Logradouro" {...register('Logradouro')} />
      <p>{errors.Logradouro?.message}</p>

      <input placeholder="Bairro" {...register('Bairro')} />
      <p>{errors.Bairro?.message}</p>

      <input placeholder="Estado" {...register('Estado')} />
      <p>{errors.Estado?.message}</p>

      <input placeholder="Número" {...register('Numero')} />
      <p>{errors.Numero?.message}</p>

      <button type="submit">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
    </form>
  );
};

export default AdvogadoForm;
