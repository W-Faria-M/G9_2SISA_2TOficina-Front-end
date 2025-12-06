import React, { useState, useEffect } from 'react';

export default function EmailVerificationModal({
  isOpen = false,
  onClose = () => {},
  email = '',
  name = '',
  sendUrl = 'http://localhost:5000/send-verification',
  expectedCode = undefined,
  onSent = () => {},
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCode('');
      setError('');
      setLoading(false);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    setError('');
    setSuccess(false);
    // basic validation: numeric, length 4-8 (adjust if necessary)
    if (!code || !/^[0-9]{4,8}$/.test(code)) {
      setError('Informe o código numérico válido (4-8 dígitos).');
      return;
    }

    // if an expectedCode was provided by the parent, validate locally first
    if (typeof expectedCode !== 'undefined') {
      if (code !== String(expectedCode)) {
        setError('Código incorreto. Verifique e tente novamente.');
        return;
      }
      // matched locally — signal success and call onSent
      setSuccess(true);
      try {
        onSent({ success: true, verifiedBy: 'local' });
      } catch (err) {
        console.warn('onSent handler error after local verify:', err);
      }
      return;
    }

    setLoading(true);
    try {
      const body = { email, code, name };
      const res = await fetch(sendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data && data.success) {
        setSuccess(true);
        onSent(data);
      } else {
        const msg = data?.error || data?.message || 'Erro ao enviar o código.';
        setError(String(msg));
      }
    } catch (err) {
      setError('Falha de rede ao enviar o código. Tente novamente.');
      console.error('EmailVerificationModal send error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    // only resend using expectedCode if available
    const codeToSend = typeof expectedCode !== 'undefined' ? String(expectedCode) : code;
    if (!codeToSend || !/^[0-9]{4,8}$/.test(codeToSend)) {
      setError('Não há código válido para reenviar.');
      return;
    }
    setLoading(true);
    try {
      const body = { email, code: codeToSend, name };
      const res = await fetch(sendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data && data.success) {
        setSuccess(true);
      } else {
        const msg = data?.error || data?.message || 'Falha ao reenviar código.';
        setError(String(msg));
      }
    } catch (err) {
      setError('Falha de rede ao reenviar código.');
      console.error('Resend error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button aria-label="fechar" style={closeBtnStyle} onClick={onClose}>✕</button>
        <h3 style={{ marginTop: 0, color: '#000', textAlign: 'center' }}>Verificação de e-mail</h3>
        <p style={{ marginTop: 4, marginBottom: 8, color: '#000', textAlign: 'center' }}>Enviaremos um código para <b>{email}</b>. Informe-o abaixo.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Código de verificação"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            style={inputStyle}
            aria-label="Código de verificação"
            disabled={loading || success}
          />

          {error && <div style={{ color: 'red', fontSize: 13, textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ color: 'green', fontSize: 13, textAlign: 'center' }}>Código enviado com sucesso.</div>}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button type="button" onClick={onClose} style={secondaryBtnStyle} disabled={loading}>
              Fechar
            </button>
            <button type="button" onClick={handleResend} style={secondaryBtnStyle} disabled={loading}>
              Reenviar código
            </button>
            <button type="submit" style={primaryBtnStyle} disabled={loading || success}>
              {loading ? 'Enviando...' : success ? 'Enviado' : 'Enviar código'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Minimal inline styles (you can move to CSS file later)
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle = {
  width: 420,
  maxWidth: '95%',
  background: '#fff',
  borderRadius: 10,
  padding: 18,
  boxSizing: 'border-box',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  position: 'relative',
  border: '2px solid #F27405',
  textAlign: 'center',
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #F27405',
  fontSize: 16,
  color: '#000',
  width: '100%',
  boxSizing: 'border-box',
};

const primaryBtnStyle = {
  background: '#F27405',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 700,
};

const secondaryBtnStyle = {
  background: '#fff',
  color: '#F27405',
  border: '1px solid #F27405',
  padding: '8px 14px',
  borderRadius: 6,
  cursor: 'pointer',
};

const closeBtnStyle = {
  position: 'absolute',
  right: 8,
  top: 8,
  border: 'none',
  background: 'transparent',
  fontSize: 18,
  cursor: 'pointer',
  color: '#F27405',
};
