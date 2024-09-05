// src/components/AdvogadoForm.tsx
import React from 'react';
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
    nome: yup.string().required('Nome é obrigatório'),
    senioridade: yup.string().required('Senioridade é obrigatória'),
    logradouro: yup.string().required('Logradouro é obrigatório'),
    bairro: yup.string().required('Bairro é obrigatório'),
    estado: yup.string().required('Estado é obrigatório'),
    cep: yup.string().required('CEP é obrigatório').matches(/^\d{5}-\d{3}$/, 'CEP inválido'),
    numero: yup.string().required('Número é obrigatório'),
});

const AdvogadoForm: React.FC<AdvogadoFormProps> = ({ onSubmit, editingId, setEditingId, user }) => {
    const { register, handleSubmit, setValue, control, formState: { errors }, reset } = useForm<AdvogadoFormData>({
        resolver: yupResolver(schema),
        defaultValues: user || {}
    });

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        const formattedCep = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Aplica a máscara
        setValue('cep', formattedCep); // Atualiza o valor do campo
    };

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.data.erro) {
                setValue('logradouro', response.data.logradouro);
                setValue('bairro', response.data.bairro);
                setValue('estado', response.data.uf);
            }
        }
    };

    const submitHandler = (data: AdvogadoFormData) => {
        onSubmit(data);
        reset();
        setEditingId(null);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)}>
        <input placeholder="Nome" {...register('nome')} />
        <p>{errors.nome?.message}</p>

        <select {...register('senioridade')}>
            <option value="">Selecione a Senioridade</option>
            <option value="Junior">Junior</option>
            <option value="Pleno">Pleno</option>
            <option value="Senior">Senior</option>
        </select>
        <p>{errors.senioridade?.message}</p>
        <Controller
                name="cep"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <input
                        {...field}
                        placeholder="CEP"
                        onChange={(e) => {
                            handleCepChange(e);
                            field.onChange(e); 
                        }}
                        onBlur={handleCepBlur}
                    />
                )}
            />

        <input placeholder="Logradouro" {...register('logradouro')} />
        <p>{errors.logradouro?.message}</p>

        <input placeholder="Bairro" {...register('bairro')} />
        <p>{errors.bairro?.message}</p>

        <input placeholder="Estado" {...register('estado')} />
        <p>{errors.estado?.message}</p>

        <input placeholder="Número" {...register('numero')} />
        <p>{errors.numero?.message}</p>

        <button type="submit">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
    </form>
    );
};

export default AdvogadoForm;
