import { useEffect, useRef, useState } from 'react';

/**
 * Modal para remover veículo.
 * Props:
 * - open: boolean controla exibição
 * - veiculos: array de veículos disponíveis para remoção
 * - onConfirm: function(veiculoId) chamada ao confirmar
 * - onClose: function para fechar sem confirmar
 * - isSubmitting: boolean para estado de envio
 */
export default function RemoverVeiculoModal({ open, veiculos, onConfirm, onClose, isSubmitting }) {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const firstSelectRef = useRef(null);

  const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
  const [confirmacao, setConfirmacao] = useState('');

  // Limpa seleção quando o modal fecha
  useEffect(() => {
    if (!open) {
      setVeiculoSelecionado('');
      setConfirmacao('');
    }
  }, [open]);

  // Focus inicial e trap básico
  useEffect(() => {
    if (open) {
      firstSelectRef.current?.focus();
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
    if (!veiculoSelecionado) {
      alert('Selecione um veículo para remover.');
      return;
    }
    onConfirm(parseInt(veiculoSelecionado, 10));
  };

  const veiculoEscolhido = veiculos.find(v => v.veiculoId === parseInt(veiculoSelecionado, 10));
  
  // Verifica se a confirmação está correta
  const textoEsperado = veiculoEscolhido ? `remover - ${veiculoEscolhido.placa}` : '';
  const confirmacaoValida = confirmacao.trim().toLowerCase() === textoEsperado.toLowerCase();

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fadeIn"
      onClick={(e) => {
        if (e.target === backdropRef.current && !isSubmitting) onClose();
      }}
      aria-hidden={!open}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="remover-veiculo-titulo"
        className="relative bg-black/85 rounded-xl shadow-2xl w-[520px] max-h-[80vh] overflow-y-hidden p-6! animate-scaleIn"
      >
        <h2 id="remover-veiculo-titulo" className="text-2xl font-semibold mb-4! text-white">
          Remover Veículo
        </h2>
        
        {veiculos.length === 0 ? (
          <div className="text-white text-center py-6">
            <p className="mb-4">Você não possui veículos cadastrados.</p>
            <button
              type="button"
              onClick={onClose}
              className="px-4! py-2! rounded-md! bg-gray-100! hover:bg-gray-400! text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4!">
            <div>
              <label htmlFor="veiculo" className="block text-sm font-medium text-white mb-1!">
                Selecione o veículo que deseja remover
              </label>
              <select
                ref={firstSelectRef}
                id="veiculo"
                value={veiculoSelecionado}
                onChange={(e) => setVeiculoSelecionado(e.target.value)}
                className="w-full px-3! py-2! border bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Escolha um veículo...</option>
                {veiculos.map((v) => (
                  <option key={v.veiculoId} value={v.veiculoId}>
                    {v.marca} {v.modelo} - {v.placa} ({v.ano})
                  </option>
                ))}
              </select>
            </div>

            {veiculoEscolhido && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-md p-4!">
                <p className="text-white text-sm mb-2 font-medium">⚠️ Detalhes do veículo a ser removido:</p>
                <div className="text-white text-sm space-y-1!">
                  <p><span className="font-medium">Marca:</span> {veiculoEscolhido.marca}</p>
                  <p><span className="font-medium">Modelo:</span> {veiculoEscolhido.modelo}</p>
                  <p><span className="font-medium">Placa:</span> {veiculoEscolhido.placa}</p>
                  <p><span className="font-medium">Ano:</span> {veiculoEscolhido.ano}</p>
                  <p><span className="font-medium">Km:</span> {veiculoEscolhido.km}</p>
                </div>
                <p className="text-red-300 text-xs mt-3!">
                  Esta ação não pode ser desfeita. Tem certeza?
                </p>
              </div>
            )}

            {veiculoEscolhido && (
              <div>
                <label htmlFor="confirmacao" className="block text-sm font-medium text-white mb-1!">
                  Para confirmar, digite: <span className="text-red-400 font-mono">REMOVER - {veiculoEscolhido.placa}</span>
                </label>
                <input
                  type="text"
                  id="confirmacao"
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value.toUpperCase())}
                  className="w-full px-3! py-2! border bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={`REMOVER - ${veiculoEscolhido.placa}`}
                />
              </div>
            )}

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
                disabled={isSubmitting || !confirmacaoValida}
                className={`px-4! py-2! rounded-md! text-sm font-medium focus:outline-none! focus:ring-2 focus:ring-red-600 transition-colors ${
                  isSubmitting || !confirmacaoValida
                    ? 'bg-red-400! cursor-not-allowed' 
                    : 'bg-red-500! hover:bg-red-600! text-white'
                }`}
              >
                {isSubmitting ? 'Removendo...' : 'Remover Veículo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
