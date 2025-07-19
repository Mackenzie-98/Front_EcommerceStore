import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#2A2823] text-[#F8FBF8] mt-section">
      <div className="container-responsive py-section">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-4 gap-element mb-section">
          {/* Brand Section */}
          <div className="mobile:col-span-2 tablet:col-span-1">
            <h3 className="text-subtitle font-semibold text-[#F8FBF8] mb-4">ZODIACO</h3>
            <p className="text-body text-[#F8FBF8]/80 mb-4 max-w-xs">
              Descubre la mejor moda para hombres y mujeres. Calidad premium, estilo único.
            </p>
            <div className="flex gap-inline">
              <div className="w-10 h-10 bg-[#F8FBF8]/10 rounded-full flex items-center justify-center">
                <span className="text-[#F8FBF8] text-sm">f</span>
              </div>
              <div className="w-10 h-10 bg-[#F8FBF8]/10 rounded-full flex items-center justify-center">
                <span className="text-[#F8FBF8] text-sm">@</span>
              </div>
              <div className="w-10 h-10 bg-[#F8FBF8]/10 rounded-full flex items-center justify-center">
                <span className="text-[#F8FBF8] text-sm">in</span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div>
            <h4 className="text-body-semibold text-[#F8FBF8] mb-4">Ayuda</h4>
            <nav className="space-y-3">
              <Link
                href="/preguntas-frecuentes"
                className="block text-body text-[#F8FBF8]/80 hover:text-[#BF1330] transition-colors"
              >
                Preguntas Frecuentes
              </Link>
              <Link
                href="/guia-tallas"
                className="block text-body text-[#F8FBF8]/80 hover:text-[#BF1330] transition-colors"
              >
                Guía de Tallas
              </Link>
              <Link href="/envios" className="block text-body text-[#F8FBF8]/80 hover:text-[#BF1330] transition-colors">
                Envíos y Devoluciones
              </Link>
              <Link
                href="/contacto"
                className="block text-body text-[#F8FBF8]/80 hover:text-[#BF1330] transition-colors"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="text-body-semibold text-[#F8FBF8] mb-4">Legal</h4>
            <nav className="space-y-3">
              <Link
                href="/terminos"
                className="block text-body text-[#F8FBF8]/80 hover:text-[#BF1330] transition-colors"
              >
                Términos y Condiciones
              </Link>
              <Link
                href="/privacidad"
                className="block text-body text-[#F8FBF8]/80 hover:text-[#BF1330] transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/cookies"
                className="block text-body text-[#F8FBF8]/80 hover:text-[#BF1330] transition-colors"
              >
                Política de Cookies
              </Link>
            </nav>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-body-semibold text-[#F8FBF8] mb-4">Contacto</h4>
            <div className="space-y-3">
              <div>
                <p className="text-body text-[#F8FBF8]/80">Horario de Atención:</p>
                <p className="text-body text-[#F8FBF8]/80">Lunes a Viernes</p>
                <p className="text-body text-[#F8FBF8]/80">9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="text-body text-[#F8FBF8]/80">+57 (1) 234-5678</p>
                <p className="text-body text-[#F8FBF8]/80">hola@zodiaco.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-[#F8FBF8]/20 pt-element mb-element">
          <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between gap-element">
            <div>
              <h4 className="text-body-semibold text-[#F8FBF8] mb-2">Suscríbete a nuestro newsletter</h4>
              <p className="text-body text-[#F8FBF8]/80">Recibe las últimas ofertas y novedades</p>
            </div>
            <div className="flex gap-inline max-w-sm w-full mobile:w-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 h-10 px-4 border border-[#F8FBF8]/40 rounded-lg bg-transparent text-[#F8FBF8] placeholder:text-[#F8FBF8]/60 focus:outline-none focus:border-[#F8FBF8] text-label"
              />
              <button className="btn-primary btn-large whitespace-nowrap">Suscribirse</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#F8FBF8]/20 pt-element">
          <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between gap-element text-center mobile:text-left">
            <p className="text-label text-[#F8FBF8]/60">© 2024 ZODIACO. Todos los derechos reservados.</p>
            <div className="flex justify-center mobile:justify-end gap-element">
              <span className="text-label text-[#F8FBF8]/60">Métodos de pago:</span>
              <div className="flex gap-inline">
                <div className="w-8 h-6 bg-[#F8FBF8]/10 rounded flex items-center justify-center">
                  <span className="text-xs text-[#F8FBF8]/60">💳</span>
                </div>
                <div className="w-8 h-6 bg-[#F8FBF8]/10 rounded flex items-center justify-center">
                  <span className="text-xs text-[#F8FBF8]/60">🏦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
