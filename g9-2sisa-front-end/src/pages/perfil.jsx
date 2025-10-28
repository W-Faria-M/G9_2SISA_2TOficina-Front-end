export default function Perfil() {
  return (
    <div className="min-w-[100vw] min-h-screen bg-linear-to-b from-[#f97316] to-[#34313129] flex items-center justify-center overflow-y-auto relative">
      <div className="flex flex-col gap-10 w-[85%] h-[90vh] relative z-0">
        <div className="flex flex-col">
          <span className="text-4xl font-bold mb-8">Perfil</span>
          <span className="text-lg text-black">Personalize sua experiência</span>
        </div>

        <div className="w-full flex gap-30 justify-center relative">
          {/* BLOCO DE SUAS INFORMAÇÕES */}
          <div className="w-2/7 min-h-125 border border-black rounded-md bg-gradient-to-b from-[#F27405] to-[#FFAB07] flex flex-col items-center p-6 shadow-md relative z-20">
            <h2 className="text-lg font-semibold text-center mb-4 text-[#2B2B2B]">
              Suas Informações
            </h2>

            {/* Foto de perfil */}
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full border-4 border-[#2B2B2B] overflow-hidden relative z-10">
                <img
                  src="https://via.placeholder.com/120x120.png?text=Foto"
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Botão de editar*/}
              <button
                className="absolute bottom-0 right-0 translate-x-2 translate-y-2 bg-[#2B2B2B] p-1.5 rounded-full text-[#F27405] shadow-md hover:scale-105 transition z-20"
              >
                ✏️
              </button>
            </div>


            {/* Dados do usuário */}
            <div className="flex flex-col items-center text-sm text-black gap-1 relative z-20">
              <p className="font-medium">nome dos Santos Silva</p>
              <p>nome@email.com</p>
              <p>Telefone: +55 (11) 9 4002 - 8922</p>
              <p>Endereço: Ainda não adicionado</p>
            </div>

            {/* Botão Editar */}
            <button className="mt-6 w-40 h-8 bg-gradient-to-b from-[#F27405] to-[#FFAB07] text-white font-semibold rounded-full border border-[#2B2B2B] shadow hover:opacity-90 transition relative z-20">
              EDITAR
            </button>
          </div>

          {/* BLOCO DIREITO */}
          <div className="w-4/7 h-full flex flex-col relative z-10">
            <section className="w-full h-1/2 flex justify-center gap-20">
              <section className="flex flex-col gap-5 items-center">
                <div className="w-55 h-35 bg-[#F27405] rounded-lg flex flex-col justify-center items-center shadow-md">
                  <span className="text-sm text-white/90">Serviços a serem realizados:</span>
                  <span className="text-4xl font-bold text-white mt-1">1</span>
                </div>
                <button className="!h-8 !w-30 text-l flex items-center justify-center text-[#F4A100] !bg-white">
                  Agendamentos
                </button>
              </section>

              <section className="flex flex-col gap-5 items-center">
                <div className="w-55 h-35 bg-[#F28907] rounded-lg flex flex-col justify-center items-center shadow-md">
                  <span className="text-sm text-white/90">Serviços já realizados:</span>
                  <span className="text-4xl font-bold text-white mt-1">2</span>
                </div>
                <button className="!h-8 !w-30 text-l flex items-center justify-center text-white !bg-[#F4A100]">
                  + Agendar
                </button>
              </section>
            </section>

            <section className="h-1/2 flex flex-col items-center gap-5">
              <span className="text-2xl text-[#F27405]">Suas Motos</span>
              <ul className="w-full min-h-35 justify-center overflow-x-auto flex gap-5 px-6">
                <li className="w-60 bg-black/45 rounded-lg p-6">
                  <p style={{ paddingLeft: "12px", margin: "8px 0 0 0" }}>Marca: Nome Marca</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Modelo: Nome Modelo</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Ano: AAAA</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Km: X km</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Placa: XYZ 0987</p>
                </li>
                <li className="w-60 bg-black/45 rounded-lg p-6">
                  <p style={{ paddingLeft: "12px", margin: "8px 0 0 0" }}>Marca: Nome Marca</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Modelo: Nome Modelo</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Ano: AAAA</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Km: X km</p>
                  <p style={{ paddingLeft: "12px", margin: 0 }}>Placa: XYZ 0987</p>
                </li>
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
      </div>
    </div>
  );
}
