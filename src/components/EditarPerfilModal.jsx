import { useEffect, useRef, useState } from 'react';
import { formatarTelefone } from '../helpers/utils';

/**
 * Modal para editar informações pessoais do usuário.
 * Props:
 * - open: boolean controla exibição
 * - dadosUsuario: { nome, sobrenome, telefone, email }
 * - onConfirm: function(dadosAtualizados) chamada ao confirmar
 * - onClose: function para fechar sem confirmar
 * - isSubmitting: boolean para estado de envio
 */
export default function EditarPerfilModal({ open, dadosUsuario, onConfirm, onClose, isSubmitting }) {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Inicializa campos com dados atuais quando o modal abre
  useEffect(() => {
    if (open && dadosUsuario) {
      setNome(dadosUsuario.nome || '');
      setSobrenome(dadosUsuario.sobrenome || '');
      setTelefone(dadosUsuario.telefone || '');
      setEmail(dadosUsuario.email || '');
    }
  }, [open, dadosUsuario]);

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
    const dadosAtualizados = {
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
    };
    onConfirm(dadosAtualizados);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
      aria-hidden={!open}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-perfil-titulo"
        className="relative bg-black/70 rounded-xl shadow-2xl w-[520px] max-h-[80vh] overflow-y-hidden p-6! animate-scaleIn"
      >
        <h2 id="editar-perfil-titulo" className="text-2xl font-semibold mb-4! text-white">
          Editar Informações Pessoais
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4!">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-white mb-1!">
              Nome
            </label>
            <input
              ref={firstInputRef}
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <label htmlFor="sobrenome" className="block text-sm font-medium text-white mb-1!">
              Sobrenome
            </label>
            <input
              type="text"
              id="sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite seu sobrenome"
              required
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-white mb-1!">
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="(11) 95786-9174"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1!">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3! py-2! border border-gray-300 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="seu@email.com"
              required
            />
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
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
