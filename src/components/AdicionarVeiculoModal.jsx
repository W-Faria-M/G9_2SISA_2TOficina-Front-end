import { useEffect, useRef, useState } from 'react';

/**
 * Modal para adicionar novo veículo.
 * Props:
 * - open: boolean controla exibição
 * - usuarioId: ID do usuário proprietário
 * - onConfirm: function(dadosVeiculo) chamada ao confirmar
 * - onClose: function para fechar sem confirmar
 * - isSubmitting: boolean para estado de envio
 */
export default function AdicionarVeiculoModal({ open, usuarioId, onConfirm, onClose, isSubmitting }) {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Estados dos campos do formulário
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');

  // Limpa campos quando o modal fecha
  useEffect(() => {
    if (!open) {
      setPlaca('');
      setMarca('');
      setModelo('');
      setAno('');
      setKm('');
    }
  }, [open]);

  // Focus inicial e trap básico
  useEffect(() => {
    if (open) {
      firstInputRef.current?.focus();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
        if (e.key === 'Tab') {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
          );
          const list = Array.from(focusable);
          if (list.length === 0) return;
          const first = list[0];
          const last = list[list.length - 1];
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosVeiculo = {
      placa: placa.trim().toUpperCase(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      ano: parseInt(ano, 10),
      km: parseFloat(km),
      usuario: {
        id: parseInt(usuarioId, 10)
      }
    };
    onConfirm(dadosVeiculo);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fadeIn"
      aria-hidden={!open}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="adicionar-veiculo-titulo"
        className="relative bg-black/85 rounded-xl shadow-2xl w-[520px] max-h-[80vh] overflow-y-hidden p-6! animate-scaleIn"
      >
        <h2 id="adicionar-veiculo-titulo" className="text-2xl font-semibold mb-4! text-white">
          Adicionar Novo Veículo
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4!">
          <div>
            <label htmlFor="placa" className="block text-sm font-medium text-white mb-1!">
              Placa
            </label>
            <input
              ref={firstInputRef}
              type="text"
              id="placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase"
              placeholder="Ex.: ABC-1234"
              required
            />
          </div>

          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-white mb-1!">
              Marca
            </label>
            <input
              type="text"
              id="marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              maxLength={45}
              className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex.: Honda, Yamaha, etc."
              required
            />
          </div>

          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-white mb-1!">
              Modelo
            </label>
            <input
              type="text"
              id="modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              maxLength={45}
              className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex.: CB 500, XRE 300, etc."
              required
            />
          </div>

          <div className="flex gap-4!">
            <div className="flex-1">
              <label htmlFor="ano" className="block text-sm font-medium text-white mb-1!">
                Ano
              </label>
              <input
                type="number"
                id="ano"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                min="1900"
                max="2099"
                className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex.: 2020"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="km" className="block text-sm font-medium text-white mb-1!">
                Quilometragem (km)
              </label>
              <input
                type="text"
                id="km"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                min="0"
                step="0.1"
                className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex.: 15000"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4! py-2! rounded-md! bg-gray-100! hover:bg-gray-400! text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4! py-2! rounded-md! text-sm font-medium focus:outline-none! focus:ring-2 focus:ring-green-600 transition-colors ${
                isSubmitting 
                  ? 'bg-green-400! cursor-not-allowed' 
                  : 'bg-green-500! hover:bg-green-600! text-white'
              }`}
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar Veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
