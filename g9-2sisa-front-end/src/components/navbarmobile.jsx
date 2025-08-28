import { useState } from "react";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black flex items-center justify-between px-4 py-2 relative">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo-2t.png" // logo na pasta public
          alt="2T Oficina"
          className="h-14 w-auto"
        />
      </div>

      {/* Botões à direita */}
      <div className="flex items-center gap-3">
        {/* Botão perfil */}
        <button className="bg-yellow-500 p-3 rounded-md text-white">
          <User size={24} />
        </button>

        {/* Botão menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-orange-500 p-3 rounded-md text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu lateral */}
      {menuOpen && (
        <div className="fixed top-0 right-0 w-2/3 sm:w-1/3 h-full bg-black shadow-lg z-40 flex flex-col items-start p-6 transition-transform duration-300">
          <h2 className="text-lg font-bold mb-6">Menu</h2>
          <nav className="flex flex-col gap-4 w-full">
            <a
              href="#"
              className="text-white hover:text-orange-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Início
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Serviços
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
