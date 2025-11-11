import { useEffect, useRef } from 'react';
import { formatarData, formatarHora } from '../helpers/utils';

/**
 * Modal de resumo do agendamento.
 * Props:
 * - open: boolean controla exibição
 * - dados: { veiculo, data, hora, descricao, servicosDetalhes: [{servicoId, nomeServico}], servicosIds: number[] }
 * - onConfirm: function chamada ao confirmar
 * - onClose: function para fechar sem confirmar
 * - isSubmitting: boolean para estado de envio
 */
export default function ResumoAgendamentoModal({ open, dados, onConfirm, onClose, isSubmitting }) {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const firstButtonRef = useRef(null);

  // Focus inicial e trap básico
  useEffect(() => {
    if (open) {
      // Foco no primeiro botão
      firstButtonRef.current?.focus();
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

  const { veiculo, data, hora, descricao, servicosDetalhes, servicosIds } = dados;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
      onMouseDown={(e) => {
        // Fecha se clicar fora
        if (e.target === backdropRef.current) onClose();
      }}
      aria-hidden={!open}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resumo-agendamento-titulo"
        className="relative bg-black/90 rounded-xl shadow-2xl w-[520px] max-h-[80vh] overflow-y-auto p-6! animate-scaleIn"
      >
        <h2 id="resumo-agendamento-titulo" className="text-2xl font-semibold mb-4!">Confirmar Agendamento</h2>
        <div className="space-y-3! text-sm!">
          <div className="flex gap-2"><span className="font-medium">Veículo:</span><span>{veiculo}</span></div>
          <div className="flex gap-2"><span className="font-medium">Data:</span><span>{formatarData(data)}</span></div>
          <div className="flex gap-2"><span className="font-medium">Hora:</span><span>{formatarHora(hora)}</span></div>
          <div>
            <span className="font-medium">Serviços ({servicosIds.length}):</span>
            <ul className="mt-1! ml-4! list-disc">
              {servicosDetalhes.map((s, i) => (
                <li key={s.servicoId}>{i + 1} - {s.nomeServico}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-medium">Descrição:</span>
            <p className="mt-1! whitespace-pre-wrap text-gray-700 text-sm border rounded p-2! bg-gray-50">{descricao}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6!">
          <button
            ref={firstButtonRef}
            type="button"
            onClick={onClose}
            className="px-4! py-2! rounded-md! bg-gray-100! hover:bg-gray-400! text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          >Editar</button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className={`px-4! py-2! rounded-md! text-sm font-medium focus:outline-none! focus:ring-2 focus:ring-green-600 transition-colors ${isSubmitting ? 'bg-green-400! cursor-not-allowed' : 'bg-green-500! hover:bg-green-800! text-white'}`}
          >{isSubmitting ? 'Enviando...' : 'Confirmar'}</button>
          <button
            type="button"
            onClick={() => { onClose(); }}
            className="px-4! py-2! rounded-md! bg-red-500! hover:bg-red-800! text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600"
          >Cancelar</button>
        </div>
      </div>
      {/* Animações simples via Tailwind custom (defina em CSS global se não existir) */}
    </div>
  );
}
