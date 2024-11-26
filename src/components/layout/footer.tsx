import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#27295b] text-white py-12 px-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/Notre-histoire" className="hover:text-[#54cead]">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#54cead]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#54cead]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/surveillance_gratuite" className="hover:text-[#54cead]">
                  Surveillance gratuite
                </Link>
              </li>
              <li>
                <Link href="/surveillance_premieum" className="hover:text-[#54cead]">
                  Surveillance premium
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/conditions-generales" className="hover:text-[#54cead]">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-[#54cead]">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Restez informé des dernières actualités et mises à jour.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded-l text-gray-900 flex-1"
              />
              <button className="bg-[#54cead] px-4 py-2 rounded-r hover:bg-[#54cead]/90">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p> {new Date().getFullYear()} SocieteBusyplace. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
