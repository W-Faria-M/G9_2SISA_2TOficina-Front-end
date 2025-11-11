import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../helpers/utils";

export default function Perfil() {
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [erroUsuarios, setErroUsuarios] = useState(null);
  const usuarioId = sessionStorage.getItem("usuarioId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await apiRequest(`http://localhost:8080/usuarios?usuarioId=${usuarioId}`);
        console.group('[Perfil] Usuários recebidos');
        console.log('Quantidade:', Array.isArray(data) ? data.length : 'Formato inesperado');
        console.log('Dados:', data);
        console.groupEnd();
        // Normalização: API retorna registros flat (usuario + veiculo). Agrupar por usuarioId.
        if (Array.isArray(data)) {
          const agrupado = data.reduce((acc, item) => {
            const id = item.usuarioId || item.idUsuario || 'desconhecido';
            if (!acc[id]) {
              acc[id] = {
                usuarioId: id,
                nomeCompleto: item.nomeCompleto || item.nome || '',
                email: item.email || '',
                telefone: item.telefone || '',
                qtdServicosPendentes: item.qtdPendentes ?? item.qtdServicosPendentes ?? 0,
                qtdServicosConcluidos: item.qtdConcluidos ?? item.qtdServicosConcluidos ?? 0,
                veiculos: []
              };
            }
            // Monta veículo se houver campos de veículo
            if (item.marca || item.modelo || item.placa) {
              acc[id].veiculos.push({
                veiculoId: item.idVeiculo || item.veiculoId || item.id || undefined,
                marca: item.marca,
                modelo: item.modelo,
                ano: item.ano,
                km: item.km,
                placa: item.placa,
              });
            }
            return acc;
          }, {});
          setUsuarios(Object.values(agrupado));
        } else {
          setUsuarios([]);
        }
      } catch (e) {
        console.group('[Perfil] Erro ao buscar usuários');
        console.error(e);
        console.groupEnd();
        setErroUsuarios(e.message);
      } finally {
        setLoadingUsuarios(false);
      }
    };
    fetchUsuarios();
  }, [usuarioId]);

  return (
    <div className="min-w-[100vw] min-h-screen bg-linear-to-b from-[#f97316] to-[#34313129] flex items-center justify-center overflow-y-auto relative">
      <div className="flex flex-col gap-10 w-[85%] h-[90vh] relative z-0">
        <div className="flex flex-col">
          <span className="text-4xl font-bold mb-8">Perfil</span>
          <span className="text-lg text-black">Personalize sua experiência</span>
        </div>
        {loadingUsuarios && (
          <div className="text-black/80 text-center">Carregando dados...</div>
        )}
        {erroUsuarios && (
          <div className="text-red-600 text-center">{erroUsuarios}</div>
        )}
        {!loadingUsuarios && !erroUsuarios && usuarios.length === 0 && (
          <div className="text-black/70 text-center">Nenhum usuário encontrado.</div>
        )}
        {!loadingUsuarios && !erroUsuarios && usuarios.length > 0 && (
        <div className="w-full flex gap-30 justify-center relative">
          {/* BLOCO DE SUAS INFORMAÇÕES */}
          <div className="w-2/7 min-h-125 border border-black rounded-md
          bg-gradient-to-b from-[#F27405] to-[#FFAB07] flex flex-col items-center !p-6 shadow-md relative z-20">
            <h2 className="text-lg font-semibold text-center !mb-4 text-[#2B2B2B]">
              Suas Informações
            </h2>

            {/* Foto de perfil */}
            <div className="relative !mb-4">
              <div className="w-28 h-28 !p-5 rounded-full border-4 border-[#2B2B2B] overflow-hidden relative z-10">
                <img
                  src="https://via.placeholder.com/120x120.png?text=Foto"
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Botão de editar*/}
              <button
                className="absolute bottom-0 right-0 bg-[#2B2B2B] !p-1.5 !rounded-full text-[#F27405] shadow-md hover:scale-105! transition! z-20"
              >
                ✏️
              </button>
            </div>
            <div className="!mb-2" />
            <br />


            {/* Dados do usuário */}
            {(() => {
              const u = usuarios[0];
              return (
                <div className="flex flex-col items-center text-sm text-black gap-1 relative z-20">
                  <p className="font-medium">{u.nomeCompleto || u.nome || 'Nome não informado'}</p>
                  <p>{u.email || 'Email não informado'}</p>
                  <p>Telefone: {u.telefone || '—'}</p>
                </div>
              );
            })()}

            {/* Botão Editar */}
            <button className="!mt-6 w-40 h-8 bg-gradient-to-b from-[#F27405] to-[#FFAB07] text-black flex items-center justify-center
            font-semibold !rounded-full !border !border-[#2B2B2B]/30 hover:border-[#2B2B2B]! shadow-md transition relative z-20">
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
                  <span className="text-4xl font-bold text-white mt-1">{usuarios[0].qtdServicosPendentes}</span>
                </div>
                <button
                  onClick={() => navigate('/agendamentos-feitos')}
                  className="!h-8 !w-30 text-l flex items-center justify-center text-[#F4A100] !bg-white hover:brightness-95 transition">
                  Agendamentos
                </button>
              </section>

              <section className="flex flex-col gap-5 items-center">
                <div className="w-55 h-35 bg-[#F28907] rounded-lg flex flex-col justify-center items-center shadow-md">
                  <span className="text-lg text-white/90">Serviços concluídos:</span>
                  <div className="h-2" />
                  <span className="text-4xl font-bold text-white mt-1">{usuarios[0].qtdServicosConcluidos}</span>
                </div>
                <button
                  onClick={() => navigate('/realizar-agendamento')}
                  className="!h-8 !w-30 text-l flex items-center justify-center text-white !bg-[#F4A100] hover:brightness-95 transition">
                  + Agendar
                </button>
              </section>
            </section>

            <section className="h-1/2 flex flex-col items-center gap-5">
              <span className="text-2xl text-[#F27405]">Suas Motos</span>
              <ul className="w-full min-h-35 justify-center overflow-x-auto flex gap-5 px-6">
                {(usuarios[0].veiculos || []).length === 0 && (
                  <li className="text-sm text-black/70">Nenhum veículo cadastrado.</li>
                )}
                {(usuarios[0].veiculos || []).map(v => (
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
                <button className="!h-7 !w-40 !rounded-full text-l flex items-center justify-center text-[#007A4D] !bg-white">
                  Adicionar
                </button>
                <button className="!h-7 !w-40 !rounded-full text-l flex items-center justify-center text-[#DF3535] !bg-white">
                  Remover
                </button>
              </div>
            </section>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}