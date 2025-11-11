import { useState, useEffect } from "react";
import { apiRequest, validateField, generateUniqueId } from "../helpers/utils";
import ResumoAgendamentoModal from "../components/ResumoAgendamentoModal";
import trocaDeOleo from "../assets/Gemini_Generated_Image_xd1a8qxd1a8qxd1a.png";
import revisaoFiltros from "../assets/Gemini_Generated_Image_lnyfj8lnyfj8lnyf.png"
import reparoFreio from "../assets/Gemini_Generated_Image_sqig5csqig5csqig.png"
import revisaoKm from "../assets/Gemini_Generated_Image_w3b4ohw3b4ohw3b4.png"

export default function RealizarAgendamento() {

  const [data, setData] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [isDomingo, setIsDomingo] = useState(false);
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [erros, setErros] = useState({});
  const formCompleto = veiculoSelecionado && data && !isDomingo && horarioSelecionado && descricaoProblema.trim() && servicosSelecionados.length > 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResumo, setShowResumo] = useState(false);

  function validarCampos() {
    const novosErros = {};
    if (!veiculoSelecionado) novosErros.veiculo = "Selecione um veículo.";
    if (!data) novosErros.data = "Selecione uma data.";
    if (isDomingo) novosErros.data = "Domingo não é permitido.";
    if (!horarioSelecionado) novosErros.hora = "Selecione um horário.";
    if (servicosSelecionados.length === 0) novosErros.servicos = "Selecione pelo menos um serviço.";
    if (!descricaoProblema.trim()) novosErros.descricao = "Descreva o problema.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleCancelar() {
    setVeiculoSelecionado("");
    setData("");
    setHorarioSelecionado("");
    setServicosSelecionados([]);
    setDescricaoProblema("");
    setErros({});
  }

  function buildPayload() {
    const usuarioId = sessionStorage.getItem("usuarioId");
    return {
      usuarioId: usuarioId ? parseInt(usuarioId, 10) : null,
      data,
      hora: horarioSelecionado,
      veiculo: veiculoSelecionado,
      descricao: descricaoProblema.trim(),
      observacao: null,
      servicosIds: servicosSelecionados.map(id => parseInt(id, 10)),
    };
  }

  async function handleConfirmAgendamento() {
    const payload = buildPayload();
    setIsSubmitting(true);
    try {
      const resposta = await apiRequest("http://localhost:8080/agendamentos", "POST", payload);
      console.group("[Agendamento] Resposta API");
      console.log("Criado:", resposta);
      console.groupEnd();
      alert("Agendamento criado com sucesso!");
      handleCancelar();
      setShowResumo(false);
    } catch (err) {
      console.group("[Agendamento] Erro no envio");
      console.error(err);
      console.groupEnd();
      alert(err.message || "Erro ao criar agendamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAvancar() {
    if (!validarCampos()) {
      // Poderia futuramente exibir mensagens mais ricas na UI
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    // Apenas abre modal de resumo
    console.group('[Agendamento] Pré-Resumo');
    console.log('Payload preview:', buildPayload());
    console.groupEnd();
    setShowResumo(true);
  }

  const [servicos, setServicos] = useState([]);

  function toggleServico(servicoId) {
    setServicosSelecionados((prev) =>
      prev.includes(servicoId) ? prev.filter((s) => s !== servicoId) : [...prev, servicoId]
    );
  }

  function isSelecionado(servicoId) {
    return servicosSelecionados.includes(servicoId);
  }

  // Fetch serviços resumidos
  useEffect(() => {
    apiRequest("http://localhost:8080/servicos/resumidos")
      .then((data) => {
        console.log("Serviços carregados:", data);
        if (Array.isArray(data)) {
          setServicos(data);
          console.log("Serviços carregados:", data);
        } else {
          console.warn("Formato inesperado ao buscar serviços:", data);
          setServicos([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar serviços:", err);
        setServicos([]);
      });
  }, []);

  // Data mínima (hoje) para impedir seleção de dias anteriores
  const hojeISO = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!data) {
      setHorarios([]);
      setIsDomingo(false);
      return;
    }

    // Detecta se a data selecionada é domingo (0)
    const diaSemana = new Date(`${data}T00:00:00`).getDay();
    if (diaSemana === 0) {
      setIsDomingo(true);
      setHorarios([]); // limpa horários se domingo
      return; // não chama API
    } else {
      setIsDomingo(false);
    }

    // Busca horários apenas se não for domingo
    apiRequest(`http://localhost:8080/agendamentos/gerar-horas-disponiveis?data=${data}`)
      .then((horarios) => {
        setHorarios(horarios || []);
      })
      .catch((error) => {
        console.error("Erro ao buscar horários disponíveis:", error);
        setHorarios([]);
      });
  }, [data]);

  useEffect(() => {
    // Carregar veículos do usuário ao montar o componente
    const usuarioId = sessionStorage.getItem("usuarioId");
    if (!usuarioId) {
      console.warn("usuarioId não encontrado no sessionStorage. O select de veículos ficará vazio.");
      setVeiculos([]);
      return;
    }

    apiRequest(`http://localhost:8080/veiculos?usuarioId=${usuarioId}`)
      .then((data) => {
        // Assumindo que data é um array de objetos com propriedades 'marca' e 'modelo'
        if (Array.isArray(data)) {
          setVeiculos(data);
        } else {
          console.warn("Formato inesperado ao buscar veículos:", data);
          setVeiculos([]);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar veículos:", error);
        setVeiculos([]);
      });
  }, []);

  return (
    <>
    <div className="min-w-screen min-h-screen bg-linear-to-b from-[#f97316] to-[#34313129] flex items-center justify-center overflow-y-auto">
      <div className="flex w-[85%] h-[90vh]">
        <div className="w-1/2 flex flex-col gap-15">
          <span>
            <span className="text-5xl">Agende Aqui:</span>
          </span>
          <div className="flex flex-col gap-5">
            <span className="text-2xl">Reserve seu atendimento em poucos cliques!</span>
            <div className="w-[82%] flex justify-between">
              <div className="w-[45%] flex flex-col items-center gap-1">
                <span className="text-l">Qual veículo precisa de atendimento?</span>
                <select
                  name="slct-veiculos"
                  className="w-[87%] bottom-0! rounded-full bg-white text-orange-500 border-2 border-amber-600"
                  value={veiculoSelecionado}
                  onChange={(e) => setVeiculoSelecionado(e.target.value)}
                >
                  <option value="" disabled>
                    {veiculos.length !== 0
                      ? "Selecione um veículo"
                      : "Nenhum veículo encontrado. Cadastre um em seu perfil antes de agendar."}
                  </option>
                  {veiculos.map((v) => {
                    const texto = `${v.descricaoVeiculo}`;
                    return (
                      <option key={v.id} value={texto}>
                        {texto}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="w-[45%] flex flex-col items-center">
                <span className="text-l">Selecione a melhor data para você.</span>
                <input
                  type="date"
                  min={hojeISO}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-[87%] flex justify-center rounded-full bg-white text-orange-500 border-2 border-amber-600"
                />
              </div>
            </div>
            <span className="text-l">Veja os horários disponíveis e escolha o que preferir.</span>
            <select 
              name="hora"
              value={horarioSelecionado}
              onChange={(e) => setHorarioSelecionado(e.target.value)}
              className="w-[82%] rounded-full flex justify-center text-center bg-white text-orange-500 border-2 border-amber-600">
              <option value="" disabled>
                {isDomingo
                  ? "A oficina não abre aos domingos"
                  : !data
                    ? "Após selecionar a data os horários aparecerão aqui"
                    : horarios.length === 0
                      ? "Nenhum horário disponível para esta data"
                      : "Selecione um horário"}
              </option>
              {!isDomingo && horarios.map((horario) => (
                <option key={generateUniqueId()} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
            <span className="w-[72%] text-l">Conte-nos qual é o problema para que possamos te atender da melhor forma.</span>
            <textarea
              name="descricao"
              value={descricaoProblema}
              onChange={(e) => setDescricaoProblema(e.target.value)}
              className="w-[82%] px-4! py-3! h-36 resize-none bg-[rgba(242,137,7,0.36)] rounded-md"
              placeholder="Descreva aqui o problema"
            ></textarea>
            <div className="flex flex-col gap-2 w-[82%]">
              <button
                onClick={handleCancelar}
                type="button"
                className="w-70 h-11 rounded-2xl! border-[none]! hover:bg-red-700! hover:border-white! hover:border-2! bg-red-600!
                flex items-center justify-center text-3xl! text-white font-semibold! leading-none!">
                Limpar
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-[82%] self-end flex flex-col gap-5">
          <span className="m-8">O que a sua moto precisa? Selecione os serviços abaixo.</span>
          <div className="w-full h-98.5 bg-[rgba(0,0,0,0.25)] rounded-md flex flex-col gap-4 p-4! scroll-mb-2 overflow-y-auto">
            <ul className="flex flex-wrap gap-5">
              {servicos.map((s) => (
                <li
                  key={s.servicoId}
                  role="button"
                  aria-pressed={isSelecionado(s.servicoId)}
                  onClick={() => toggleServico(s.servicoId)}
                  className={`relative w-47 h-28 cursor-pointer group rounded-md overflow-hidden border transition-all duration-200
                    ${isSelecionado(s.servicoId) ? 'ring-2 ring-orange-500 border-orange-500' : 'border-transparent hover:border-orange-400'}`}
                >
                  <img
                    src={s.nomeServico === "Troca de Óleo" ? trocaDeOleo : s.nomeServico === "Revisão de Filtros" ? revisaoFiltros :
                      s.nomeServico === "Reparo no Freio" ? reparoFreio : s.nomeServico === "Revisão Periódica 10.000km" ? revisaoKm : ""}
                    alt={s.nomeServico}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span
                    className={`absolute bottom-0 left-0 w-full text-center text-l font-medium tracking-wide px-2 py-1
                      ${isSelecionado(s.servicoId) ? 'bg-orange-600/80' : 'bg-black group-hover:bg-black'} text-white`}
                  >
                    {s.nomeServico}
                  </span>
                  {isSelecionado(s.servicoId) && (
                    <div className="absolute inset-0 bg-orange-600/9 text-l pointer-events-none" />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex flex-col items-end group">
            <button
              onClick={handleAvancar}
              type="button"
              disabled={!formCompleto || isSubmitting}
              className={`w-70 h-11 rounded-2xl! border-[none]! flex items-center justify-center self-end text-3xl! font-semibold! leading-none! transition-colors
                ${formCompleto && !isSubmitting ? 'bg-green-600! hover:bg-green-700! hover:border-white! hover:border-2! text-white' : 'bg-gray-400! text-gray-700 cursor-not-allowed'}`}
            >
              {isSubmitting ? 'Enviando...' : 'Avançar'}
            </button>
            {!formCompleto && !isSubmitting && (
              <span className="absolute -top-7 right-10 bg-black/80 text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Preencha todos os campos para avançar
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
    <ResumoAgendamentoModal
      open={showResumo}
      dados={{
        ...buildPayload(),
        servicosDetalhes: servicos.filter(s => servicosSelecionados.includes(s.servicoId)),
      }}
      onConfirm={handleConfirmAgendamento}
      onClose={() => !isSubmitting && setShowResumo(false)}
      isSubmitting={isSubmitting}
    />
    </>
  );
}
