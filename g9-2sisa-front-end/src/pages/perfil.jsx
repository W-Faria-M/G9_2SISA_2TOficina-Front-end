import "./perfil.css"

export default function Perfil() {
  return (
    <div className="perfil-page-wrapper">
      <header className="perfil-page-header">
        <h1>Perfil</h1>
        <p>Personalize sua experiência</p>
      </header>

      <div className="perfil-page-content">
        {/* Left Panel - User Information */}
        <div className="perfil-info-panel">
          <h2>Suas Informações</h2>

          <div className="perfil-photo-container">
            <div className="perfil-photo-circle">
              <img src="/profile-placeholder.jpg" alt="Foto de perfil" />
            </div>
            <button className="perfil-edit-photo-btn" aria-label="Editar foto">
              ✏️
            </button>
          </div>

          <div className="perfil-info-item">
            <p className="perfil-info-label">nome dos Santos Silva</p>
          </div>

          <div className="perfil-info-item">
            <p className="perfil-info-label">nome@email.com</p>
          </div>

          <div className="perfil-info-item">
            <p className="perfil-info-label">Telefone: + 55 (11) 9 4002 - 8922</p>
          </div>

          <div className="perfil-info-item">
            <p className="perfil-info-label">Endereço: Ainda não adicionado</p>
          </div>

          <button className="perfil-btn-editar">EDITAR</button>
        </div>

        {/* Right Panel - Services and Motorcycles */}
        <div className="perfil-main-panel">
          {/* Services Section */}
          <div className="perfil-services-section">
            <div className="perfil-service-card">
              <p className="perfil-service-label">Serviços e serem realizados</p>
              <p className="perfil-service-number">1</p>
            </div>

            <div className="perfil-service-card">
              <p className="perfil-service-label">Serviços já realizados</p>
              <p className="perfil-service-number">2</p>
            </div>
          </div>

          <div className="perfil-action-buttons">
            <button className="perfil-btn-reagendar">AGENDAMENTOS</button>
            <button className="perfil-btn-agendar">+ AGENDAR</button>
          </div>

          {/* Motorcycles Section */}
          <div className="perfil-motos-section">
            <h2>Suas Motos</h2>

            <div className="perfil-motos-grid">
              <div className="perfil-moto-card">
                <p>
                  <strong>Marca:</strong> Nome Marca
                </p>
                <p>
                  <strong>Modelo:</strong> Nome Modelo
                </p>
                <p>
                  <strong>Ano:</strong> AAAA
                </p>
                <p>
                  <strong>Km:</strong> x km
                </p>
                <p>
                  <strong>Placa:</strong> ABC 1234
                </p>
              </div>

              <div className="perfil-moto-card">
                <p>
                  <strong>Marca:</strong> Nome Marca
                </p>
                <p>
                  <strong>Modelo:</strong> Nome Mode
                </p>
                <p>
                  <strong>Ano:</strong> AAAA
                </p>
                <p>
                  <strong>Km:</strong> x km
                </p>
                <p>
                  <strong>Placa:</strong> XYZ 0987
                </p>
              </div>
            </div>

            <div className="perfil-moto-buttons">
              <button className="perfil-btn-adicionar">ADICIONAR</button>
              <button className="perfil-btn-remover">REMOVER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
