import React, { useState, useEffect } from "react";
import "./home.css";

export default function Home() {
  const [index, setIndex] = useState(0);

  const images = [
    { src: "src/assets/pneu.png", title: "Revisão de Freios" },
    { src: "src/assets/energia.png", title: "Teste de Bateria" },
    { src: "src/assets/oleo.png", title: "Troca de Óleo" },
    { src: "src/assets/alinhamento.png", title: "Alinhamento" },
    { src: "src/assets/manutencao.png", title: "Manutenção Geral" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Seção 1 */}
      <div className="secao-1">
        <div className="esquerda">
          <h2>
            Somos apaixonados por motos e especialistas em oferecer o <br />
            melhor atendimento para você e sua máquina. Aqui, cada <br />
            serviço é feito com qualidade e compromisso.
          </h2>
          <h4>
            A sua moto merece o melhor cuidado. Agende seu atendimento <br />
            e deixe sua máquina em boas mãos!
          </h4>
          <button>AGENDAR</button>
        </div>
        <div className="direita">
          <img src="src/assets/foto_oficina.png" alt="" />
        </div>
      </div>

      {/* Seção 2 */}
      <div className="secao-2">
        <div className="Gian">
          <img src="src/assets/Gian.png" alt="" />
          <div className="quadrado">
            <div className="text">
              “Sou o Gian, tenho 20 anos e sempre fui muito ligado a motos.
              Desde pequeno sonho em ter um espaço meu para colaborar com os
              outros. Hoje, em minha oficina ofereço diversos serviços
              interessantes e recomendo que dê uma olhada para nos conhecer
              melhor.“
            </div>
          </div>
        </div>

        <div className="oficina">
          <div className="conteudo">
            <img src="src/assets/piso_oficina.png" alt="" />
            <div className="textos">
              <h2>Movidos pela paixão por motos</h2>
              Nossa oficina nasceu da paixão por motores e da vontade de
              oferecer um serviço transparente e de confiança. Com anos de
              experiência, garantimos um atendimento eficiente e honesto, para
              que sua moto esteja sempre pronta para rodar.
            </div>
          </div>
          <h1>Nossos Serviços</h1>
        </div>
      </div>

      {/* Carrossel */}
      <div className="carousel">
        <div className="carousel-track">
          {images.map((img, i) => {
            let position = (i - index + images.length) % images.length;
            let className =
              position === 0
                ? "item center"
                : position === 1 || position === images.length - 1
                ? "item side"
                : "item hidden";

            return (
              <div key={i} className={className}>
                <img src={img.src} alt={img.title} />
                <div className="overlay">
                  <p>{img.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="indicators">
          {images.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="secao-4">
          <h2>Precisa de um serviço? Agende agora seu atendimento de forma rápida e prática.</h2>

          <button>AGENDAR</button>
      </div>

      <div className="secao-5">
          <h2> Está com dúvidas? Entre em contato:</h2>
          <p>
            Telefone: (11) 98861-9917 <br />
            E-mail: contato@oficina.com
          </p>
            <div className="contact__down_bottom">
        <div className="contact__down-content">
          <a
            href="https://wa.me/5511988619917"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__whatsapp"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="contact__icon"
            />
            <span>(11) 98861-9917</span>
          </a>
          <a
            href="https://instagram.com/2t.oficina"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__instagram"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
              alt="Instagram"
              className="contact__icon"
            />
            <span>@2T.OFICINA</span>
          </a>
        </div>
      </div>

      </div>

      
      
    </div>
  );
}