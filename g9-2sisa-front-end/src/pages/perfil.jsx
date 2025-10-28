export default function Perfil() {
  return (
    <div className="min-w-[100vw] min-h-screen bg-linear-to-b from-[#f97316] to-[#34313129] flex items-center justify-center overflow-y-auto">
      <div className="flex flex-col gap-10 w-[85%] h-[90vh]">
        <div className="flex flex-col">
          <span className="text-4xl font-bold mb-8">Perfil</span>
          <span className="text-lg text-black">Personalize sua experiência</span>
        </div>
        <div className="w-full flex gap-30 justify-center">
          <div className="w-2/7 min-h-125 border-2 border-black rounded-md bg-linear-to-b from-[#F27405] to-[#FFAB07]">

          </div>
          <div className="w-4/7 h-full flex flex-col">
            <section className="w-full h-1/2 flex justify-center gap-20">
              <section className="flex flex-col gap-5 items-center">
                <div className="w-55 h-35 bg-[#F27405] rounded-lg"></div>
                <button className="!h-8 !w-30 text-l flex items-center justify-center text-[#F4A100] !bg-white">Agendamentos</button>
              </section>
              <section className="flex flex-col gap-5 items-center">
                <div className="w-55 h-35 bg-[#F28907] rounded-lg"></div>
                <button className="!h-8 !w-30 text-l flex items-center justify-center text-white !bg-[#F4A100]">+ Agendar</button>
              </section>
            </section>
            <section className="h-1/2 flex flex-col items-center gap-5">
              <span className="text-2xl text-[#F27405]">Suas Motos</span>
              <ul className="w-full min-h-35 justify-center overflow-x-auto flex gap-5 px-6">
                <li className="w-60 bg-black/45 rounded-lg p-6">
                  <p className="pl-4">Marca: Nome Marca</p>
                  <p className="pl-4">Modelo: Nome Modelo</p>
                  <p className="pl-4">Ano: AAAA</p>
                  <p className="pl-4">Km: X km</p>
                  <p className="pl-4">Placa: XYZ 0987</p>
                </li>
                <li className="w-60 bg-black/45 rounded-lg p-6">
                  <p className="pl-1">Marca: Nome Marca</p>
                  <p className="pl-4">Modelo: Nome Modelo</p>
                  <p className="pl-4">Ano: AAAA</p>
                  <p className="pl-4">Km: X km</p>
                  <p className="pl-4">Placa: XYZ 0987</p>
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



