export default function SocialButtons() {
  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2 z-50">
      {/* WhatsApp */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 p-2 rounded-md shadow-lg flex items-center justify-center"
      >
        <img src="/whatsapp.png" alt="WhatsApp" className="h-6 w-6" />
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com/suaoficina"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-pink-600 p-2 rounded-md shadow-lg flex items-center justify-center"
      >
        <img src="/instagram.png" alt="Instagram" className="h-6 w-6" />
      </a>
    </div>
  );
}
