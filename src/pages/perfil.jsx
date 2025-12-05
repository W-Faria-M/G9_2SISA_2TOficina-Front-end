import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../helpers/utils";
import EditarPerfilModal from "../components/EditarPerfilModal";
import AdicionarVeiculoModal from "../components/AdicionarVeiculoModal";
import RemoverVeiculoModal from "../components/RemoverVeiculoModal";
import FotoPerfil from "../components/fotoPerfil.jsx";
import PopupSucesso from "../components/PopupSucesso";
import PopupErro from "../components/PopupErro";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);
  const [erroUsuarios, setErroUsuarios] = useState(null);
  const [erroVeiculos, setErroVeiculos] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAdicionarOpen, setIsModalAdicionarOpen] = useState(false);
  const [isModalRemoverOpen, setIsModalRemoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });
  const usuarioId = sessionStorage.getItem("usuarioId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await apiRequest(`http://localhost:8080/usuarios?usuarioId=${usuarioId}`);
        console.group('[Perfil] Dados do usuário recebidos');
        console.log('Dados:', data);
        console.groupEnd();
        
        if (Array.isArray(data) && data.length > 0) {
          setUsuario(data[0]);
        } else if (data && typeof data === 'object') {
          setUsuario(data);
        } else {
          setUsuario(null);
        }
      } catch (e) {
        console.group('[Perfil] Erro ao buscar usuário');
        console.error(e);
        console.groupEnd();
        setErroUsuarios(e.message);
      } finally {
        setLoadingUsuarios(false);
      }
    };

    const fetchVeiculos = async () => {
      try {
        const data = await apiRequest(`http://localhost:8080/veiculos/perfil?usuarioId=${usuarioId}`);
        console.group('[Perfil] Veículos recebidos');
        console.log('Quantidade:', Array.isArray(data) ? data.length : 'Formato inesperado');
        console.log('Dados:', data);
        console.groupEnd();
        
        if (Array.isArray(data)) {
          setVeiculos(data);
        } else {
          setVeiculos([]);
        }
      } catch (e) {
        console.group('[Perfil] Erro ao buscar veículos');
        console.error(e);
        console.groupEnd();
        setErroVeiculos(e.message);
      } finally {
        setLoadingVeiculos(false);
      }
    };

    fetchUsuario();
    fetchVeiculos();
  }, [usuarioId]);

  const handleAtualizarPerfil = async (dadosAtualizados) => {
    setIsSubmitting(true);
    try {
      await apiRequest(
        `http://localhost:8080/usuarios/atualizar-campo/${usuarioId}`,
        "PATCH",
        dadosAtualizados
      );
      console.group('[Perfil] Atualização bem-sucedida');
      console.log('Dados enviados:', dadosAtualizados);
      console.groupEnd();
      setPopupSucesso({ show: true, mensagem: "Informações atualizadas com sucesso!" });
      setIsModalOpen(false);
      // Recarrega os dados do usuário
      const data = await apiRequest(`http://localhost:8080/usuarios?usuarioId=${usuarioId}`);
      if (Array.isArray(data) && data.length > 0) {
        setUsuario(data[0]);
      } else if (data && typeof data === 'object') {
        setUsuario(data);
      }
    } catch (error) {
      console.group('[Perfil] Erro ao atualizar');
      console.error(error);
      console.groupEnd();
      setPopupErro({ show: true, mensagem: "Não foi possível atualizar suas informações. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdicionarVeiculo = async (dadosVeiculo) => {
    setIsSubmitting(true);
    try {
      await apiRequest(
        "http://localhost:8080/veiculos",
        "POST",
        dadosVeiculo
      );
      console.group('[Perfil] Veículo adicionado');
      console.log('Dados enviados:', dadosVeiculo);
      console.groupEnd();
      setPopupSucesso({ show: true, mensagem: "Veículo adicionado com sucesso!" });
      setIsModalAdicionarOpen(false);
      // Recarrega a lista de veículos
      const data = await apiRequest(`http://localhost:8080/veiculos/perfil?usuarioId=${usuarioId}`);
      if (Array.isArray(data)) {
        setVeiculos(data);
      }
    } catch (error) {
      console.group('[Perfil] Erro ao adicionar veículo');
      console.error(error);
      console.groupEnd();
      setPopupErro({ show: true, mensagem: "Não foi possível adicionar o veículo. Verifique os dados e tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoverVeiculo = async (veiculoId) => {
    setIsSubmitting(true);
    try {
      await apiRequest(
        `http://localhost:8080/veiculos/${veiculoId}`,
        "DELETE"
      );
      console.group('[Perfil] Veículo removido');
      console.log('ID do veículo:', veiculoId);
      console.groupEnd();
      setPopupSucesso({ show: true, mensagem: "Veículo removido com sucesso!" });
      setIsModalRemoverOpen(false);
      // Recarrega a lista de veículos
      const data = await apiRequest(`http://localhost:8080/veiculos/perfil?usuarioId=${usuarioId}`);
      if (Array.isArray(data)) {
        setVeiculos(data);
      }
    } catch (error) {
      console.group('[Perfil] Erro ao remover veículo');
      console.error(error);
      console.groupEnd();
      setPopupErro({ show: true, mensagem: "Não foi possível remover o veículo. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const prepararDadosParaEdicao = () => {
    if (!usuario) return {};
    // Separa nome completo em nome e sobrenome
    const nomeCompleto = usuario.nomeCompleto || '';
    const partesNome = nomeCompleto.split(' ');
    const nome = partesNome[0] || '';
    const sobrenome = partesNome.slice(1).join(' ') || '';
    
    return {
      nome,
      sobrenome,
      telefone: usuario.telefone || '',
      email: usuario.email || '',
      dataNascimento: usuario.dataNascimento || '',
    };
  };

  return (
    <div className="min-w-screen min-h-screen bg-[#2B2B2B] flex items-center justify-center overflow-y-auto relative">
      <div className="flex flex-col gap-10 w-[85%] h-[90vh] relative z-0">
        <div className="flex flex-col">
          <span className="text-5xl font-bold mb-8">Perfil</span>
          <span className="text-lg text-[#F27405]">Personalize sua experiência</span>
        </div>
        {loadingUsuarios && (
          <div className="text-black/80 text-center">Carregando dados...</div>
        )}
        {erroUsuarios && (
          <div className="text-red-600 text-center">{erroUsuarios}</div>
        )}
        {!loadingUsuarios && !erroUsuarios && !usuario && (
          <div className="text-black/70 text-center">Nenhum usuário encontrado.</div>
        )}
        {!loadingUsuarios && !erroUsuarios && usuario && (
        <div className="w-full flex gap-30 justify-center relative">
          {/* BLOCO DE SUAS INFORMAÇÕES */}
          <div className="w-2/7 max-h-125 border border-black rounded-md
          bg-linear-to-b from-[#F27405] to-[#FFAB07] flex flex-col items-center p-6! shadow-md relative z-20">
            <h2 className="text-lg font-semibold text-center mb-4! text-[#2B2B2B]">
              Suas Informações
            </h2>

            {/* Foto de perfil */}
             <FotoPerfil usuarioId={usuarioId} />
             <div className="mb-2!" />
             <br />


            {/* Dados do usuário */}
            <div className="flex flex-col items-center text-sm text-black gap-1 relative z-20">
              <p className="font-medium">{usuario.nomeCompleto || 'Nome não informado'}</p>
              <p>{usuario.email || 'Email não informado'}</p>
              <p>Telefone: {usuario.telefone || '—'}</p>
            </div>

            {/* Botão Editar */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6! w-40 h-8 bg-white! text-orange-700 flex items-center justify-center
              font-semibold rounded-full! border! border-[#2B2B2B]/30! hover:border-[#2B2B2B]! shadow-md transition relative z-20"
            >
              EDITAR
            </button>
          </div>

          {/* BLOCO DIREITO */}
          <div className="w-4/7 h-full flex flex-col relative z-10">
            <section className="w-full h-1/2 flex justify-center gap-20">
              <section className="flex flex-col gap-5 items-center">
                <div className="w-55 h-35 bg-[#F27405] rounded-lg flex flex-col justify-center items-center shadow-md">
                  <span className="text-lg text-white/90">Serviços a realizar:</span>
                  <div className="h-2" />
                  <span className="text-4xl font-bold text-white mt-1">{usuario.qtdPendentes || 0}</span>
                </div>
                <button
                  onClick={() => navigate('/agendamentos-feitos')}
                  className="h-8! w-30! text-l flex items-center justify-center text-orange-700 bg-white! hover:brightness-95 transition">
                  Agendamentos
                </button>
              </section>

              <section className="flex flex-col gap-5 items-center">
                <div className="w-55 h-35 bg-[#F28907] rounded-lg flex flex-col justify-center items-center shadow-md">
                  <span className="text-lg text-white/90">Serviços concluídos:</span>
                  <div className="h-2" />
                  <span className="text-4xl font-bold text-white mt-1">{usuario.qtdConcluidos || 0}</span>
                </div>
                <button
                  onClick={() => navigate('/realizar-agendamento')}
                  className="h-8! w-30! text-l flex items-center justify-center text-white bg-[#F4A100]! hover:brightness-95 transition">
                  + Agendar
                </button>
              </section>
            </section>

            <section className="h-1/2 flex flex-col items-center gap-5">
              <span className="text-2xl text-[#F27405]">Suas Motos</span>
              <ul className="w-full min-h-35 justify-center overflow-x-auto flex gap-5 px-6">
                {veiculos.length === 0 && (
                  <div className="w-full flex items-center justify-center">
                    <div className="bg-white border-2 border-dashed border-[#F27405]! rounded-lg p-8! text-center max-w-md">
                      <p className="text-lg font-bold text-[#F27405] mb-2">Atenção</p>
                      <p className="text-sm text-[#333]">Você precisa cadastrar pelo menos um veículo para realizar um agendamento.</p>
                    </div>
                  </div>
                )}
                {veiculos.map(v => (
                  <li key={v.veiculoId || v.placa || Math.random()} className="w-60 bg-black/45 rounded-lg p-6">
                    <p style={{ paddingLeft: '12px', margin: '8px 0 0 0' }}>Marca: {v.marca || '—'}</p>
                    <p style={{ paddingLeft: '12px', margin: 0 }}>Modelo: {v.modelo || '—'}</p>
                    <p style={{ paddingLeft: '12px', margin: 0 }}>Ano: {v.ano || '—'}</p>
                    <p style={{ paddingLeft: '12px', margin: 0 }}>Km: {v.km ?? '—'}</p>
                    <p style={{ paddingLeft: '12px', margin: 0 }}>Placa: {v.placa || '—'}</p>
                  </li>
                ))}
              </ul>
              <div className="flex h-full items-end gap-10">
                <button 
                  onClick={() => setIsModalAdicionarOpen(true)}
                  className="h-7! w-40! rounded-full! text-l flex items-center justify-center text-[#007A4D] bg-white! hover:brightness-95 transition"
                >
                  Adicionar
                </button>
                <button 
                  onClick={() => setIsModalRemoverOpen(true)}
                  className="h-7! w-40! rounded-full! text-l flex items-center justify-center text-[#DF3535] bg-white! hover:brightness-95 transition"
                >
                  Remover
                </button>
              </div>
            </section>
          </div>
        </div>
        )}
      </div>

      {/* Modal de Edição */}
      <EditarPerfilModal
        open={isModalOpen}
        dadosUsuario={prepararDadosParaEdicao()}
        onConfirm={handleAtualizarPerfil}
        onClose={() => setIsModalOpen(false)}
        isSubmitting={isSubmitting}
      />

      {/* Modal de Adicionar Veículo */}
      <AdicionarVeiculoModal
        open={isModalAdicionarOpen}
        usuarioId={usuarioId}
        onConfirm={handleAdicionarVeiculo}
        onClose={() => setIsModalAdicionarOpen(false)}
        isSubmitting={isSubmitting}
      />

      {/* Modal de Remover Veículo */}
      <RemoverVeiculoModal
        open={isModalRemoverOpen}
        veiculos={veiculos}
        onConfirm={handleRemoverVeiculo}
        onClose={() => setIsModalRemoverOpen(false)}
        isSubmitting={isSubmitting}
      />

      {popupSucesso.show && (
        <PopupSucesso
          mensagem={popupSucesso.mensagem}
          onClose={() => setPopupSucesso({ show: false, mensagem: "" })}
          darkMode={true}
        />
      )}
      {popupErro.show && (
        <PopupErro
          mensagem={popupErro.mensagem}
          onClose={() => setPopupErro({ show: false, mensagem: "" })}
          darkMode={true}
        />
      )}
    </div>
  );
}