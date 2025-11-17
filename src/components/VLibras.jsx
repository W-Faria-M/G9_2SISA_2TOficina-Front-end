import { useEffect } from "react";

export default function VLibras() {
  useEffect(() => {
    if (document.getElementById("vlibras-script")) return;

    const script = document.createElement("script");
    script.id = "vlibras-script";
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;

    script.onload = () => {
      if (window && (window).VLibras) {
        try {
          // inicializa o widget (URL do app oficial)
          new window.VLibras.Widget("https://vlibras.gov.br/app");
        } catch (err) {
          console.error("VLibras init error:", err);
        }
      } else {
        console.error("VLibras: window.VLibras não encontrado após carregar script.");
      }
    };

    script.onerror = (e) => {
      console.error("Falha ao carregar vlibras-plugin.js", e);
    };

    document.body.appendChild(script);
  }, []);

  // atributos customizados precisam ser passados via spread em JSX
  return (
    <div {...{ vw: "" }} className="enabled">
      <div {...{ "vw-access-button": "" }} className="active" />
      <div {...{ "vw-plugin-wrapper": "" }}>
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}