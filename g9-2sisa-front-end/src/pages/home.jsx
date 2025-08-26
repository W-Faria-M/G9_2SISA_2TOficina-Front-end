import "./home.css";

export default function home() {
    return (
        <div className="home-container">

            <div className="secao-1">
                <div className="esquerda">
                    <h2> 
                        Somos apaixonados por motos e especialistas em oferecer o <br></br>
                         melhor atendimento para você e sua máquina. Aqui, cada <br />
                        serviço é feito com qualidade e compromisso.
                    </h2>
                    <h4>
                         A sua moto merece o melhor cuidado. Agende seu atendimento 
                         e deixe sua <br />máquina em boas mãos!
                    </h4>

                    <button>AGENDAR</button>
                </div>
                <div className="direita">
                    <img src="src/assets/foto_oficina.png" alt="" />
                </div>
            </div>

            

        </div>
    )
}