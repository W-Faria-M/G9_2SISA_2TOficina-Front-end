import React from "react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-200 py-8 px-4 text-center">
      <p className="text-lg mb-2">
        "Está com dúvidas? Entre em contato"
      </p>
      <p className="text-sm">Telefone: (XX) XXXX-XXXX</p>
      <p className="text-sm mb-4">E-mail: contato@oficina.com</p>

      <hr className="border-t border-orange-500 w-1/2 mx-auto my-4" />

      <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-2 md:space-y-0 text-sm">
        <span>Endereço</span>
        <span>|</span>
        <span>Horário de Funcionamento</span>
      </div>

      <div className="mt-4 text-sm">
        Redes Sociais
      </div>
    </footer>
  );
}
