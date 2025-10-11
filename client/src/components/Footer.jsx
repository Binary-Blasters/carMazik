export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/6 py-8 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center">
              <span className="text-white font-extrabold">CM</span>
            </div>
            <div className="text-white font-semibold">CarMazik</div>
          </div>
          <p className="mt-3 text-sm text-gray-400">Premium cars — transparent process. © CarMazik</p>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-white">Explore</div>
          <div className="mt-3 flex flex-col gap-2">
            <a>Featured Cars</a>
            <a>Sell With Us</a>
            <a>Financing</a>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-white">Contact</div>
          <div className="mt-3 text-gray-400 text-sm">support@carmazik.com</div>
          <div className="mt-2 text-gray-400 text-sm">+91 98765 43210</div>
        </div>
      </div>
    </footer>
  );
}