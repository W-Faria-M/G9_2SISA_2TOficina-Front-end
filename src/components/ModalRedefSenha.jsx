import React, { useState, useEffect, useRef } from "react";
import "./ModalRedefSenha.css";

export default function ModalRedefSenha({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); 
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setEmail("");
      setSenha("");
      setConfirma("");
      setMsg("");
      setStatus("");
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape" && isOpen) onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  function validarEmail(valor) {
    return /\S+@\S+\.\S+/.test(valor);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(""); setStatus("");

    if (!validarEmail(email)) {
      setMsg("Informe um e‑mail válido.");
      setStatus("error");
      return;
    }
    if (!senha || senha.length < 6) {
      setMsg("Senha deve ter pelo menos 6 caracteres.");
      setStatus("error");
      return;
    }
    if (senha !== confirma) {
      setMsg("As senhas não coincidem.");
      setStatus("error");
      return;
    }

    setMsg("Enviando...");
    setStatus("");
    try {
      
      const res = await fetch("http://localhost:8080/usuarios/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senhaNova: senha })
      });

      const contentType = res.headers.get("content-type") || "";
      let body = null;
      if (contentType.includes("application/json")) body = await res.json();
      else body = await res.text();

      if (!res.ok) {
        const serverMsg = typeof body === "string" && body ? body : (body && body.message) || `Status ${res.status}`;
        throw new Error(serverMsg);
      }

      if (body && typeof body === "object" && (body.success === false || body.error)) {
        const serverMsg = body.message || body.error || "Erro ao processar requisição.";
        throw new Error(serverMsg);
      }

      setMsg("Senha alterada com sucesso.");
      setStatus("success");
      setTimeout(onClose, 1400);
    } catch (err) {
      console.error("ModalRedefSenha error:", err);
      setMsg(err && err.message ? err.message : "Erro ao alterar senha. Tente novamente.");
      setStatus("error");
    }
  }

  return (
    <div
      className={`modal-overlay ${isOpen ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ display: isOpen ? "flex" : "none" }}
    >
      <div className="modal" role="document">
        <button className="close" onClick={onClose} aria-label="Fechar">✕</button>
        <h3>Redefinir senha</h3>
        <p>Informe o e‑mail cadastrado e defina sua nova senha.</p>

        <form onSubmit={handleSubmit}>
          <div className="input">
            <input
              ref={inputRef}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setMsg(""); setStatus(""); }}
              required
            />
          </div>

          <div className="input">
            <input
              type="password"
              placeholder="Nova senha"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setMsg(""); setStatus(""); }}
              required
            />
          </div>

          <div className="input">
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirma}
              onChange={(e) => { setConfirma(e.target.value); setMsg(""); setStatus(""); }}
              required
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">Salvar</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          </div>

          {msg && <div className={`msg ${status === "success" ? "success" : status === "error" ? "error" : ""}`}>{msg}</div>}
        </form>
      </div>
    </div>
  );
}