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

            <div className="secao-2">
                <div className="Gian">
                    <img src="src/assets/Gian.png" alt="" />
                    <div className="quadrado">
                        <div className="text">
                            “Sou o Gian, tenho 20 anos e sempre fui muito ligado a motos. 
                            Desde pequeno sonho em ter um espaço meu para colaborar com os 
                            outros. Hoje, em minha oficina ofereço diversos serviços interessantes 
                            e recomendo que  dê uma olhada para nos conhecer melhor. “
                        </div>
                    </div>
                </div>

                <div className="oficina">
                    <div className="conteudo">
                        <img src="src/assets/piso_oficina.png" alt="" />
                        <div className="textos">
                            <h2>Movidos pela paixão por motos </h2>
                            Nossa oficina nasceu da paixão por motores e da vontade de oferecer um 
                            serviço transparente e de confiança. Com anos de experiência, garantimos 
                            um atendimento eficiente e honesto, para que sua moto esteja sempre pronta 
                            para rodar.
                        </div>
                    </div>
                        <h1>
                            Nossos Serviços
                        </h1>
                    
                </div>
            </div>
            

        </div>
    )
}