import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#27295b] text-white">
      <div className="container mx-auto px-8 md:px-16 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Company Info */}
          <div className="md:col-span-5">
            <Image
              src="/images/newlogo.svg"
              alt="Busyplace"
              width={240}
              height={80}
              className="mb-6 brightness-0 invert w-[15rem] h-auto"
            />
            <p className="text-[18px] leading-7 mb-8 text-white font-light">
              Parce que notre priorité est de vous simplifier la vie et de rendre votre expérience d'entrepreneur inoubliable, nous avons mis en place des solutions complètes, performantes et à disposition toute notre expertise de professionnels pour vous accompagner et vous assister sereinement tout au long de la durée de vie de votre entreprise.
            </p>
          </div>

          {/* Links Section */}
          <div className="md:col-span-3 md:ml-8">
            <div className="h-[86px] flex items-end mb-6">
              <h3 className="text-2xl font-medium text-white">Qui sommes-nous ?</h3>
            </div>
            <ul className="space-y-3 text-[18px] font-light">
              <li>
                <Link href="https://blog.legals.fr/" className="text-white hover:text-[#1CBE93] transition-colors duration-300">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="https://www.busyplace.fr/mentions-legales" className="text-white hover:text-[#1CBE93] transition-colors duration-300">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="https://www.busyplace.fr/conditions-generales-vente" className="text-white hover:text-[#1CBE93] transition-colors duration-300">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="https://www.busyplace.fr/faq" className="text-white hover:text-[#1CBE93] transition-colors duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-4">
            <div className="h-[86px] flex items-end mb-6">
              <h3 className="text-2xl font-medium text-white">Nous contacter</h3>
            </div>
            <ul className="space-y-3 text-[18px] font-light">
              <li>
                <span className="text-white">Busyplace - 128 Rue La Boetie, 75008 Paris</span>
              </li>
              <li>
                <a href="mailto:contact@busyplace.fr" className="text-white hover:text-[#1CBE93] transition-colors duration-300">
                  contact@busyplace.fr
                </a>
              </li>
              <li>
                <a href="tel:01 53 65 16 66" className="text-white hover:text-[#1CBE93] transition-colors duration-300">
                  01 53 65 16 66
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Social Media */}
        <div className="border-t-[2px] border-white pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[18px] text-white font-light mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} BusyPlace | Tous droits réservés.
            </p>
            
            <div className="flex space-x-8">
              <a 
                href="https://www.facebook.com/busyplace.france" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#1CBE93] group transition-colors duration-300"
              >
                <i className="fa fa-facebook text-[1.8rem] text-[#27295b] group-hover:text-white transition-colors duration-300"></i>
              </a>
              <a 
                href="https://twitter.com/Busyplace_fr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#1CBE93] group transition-colors duration-300"
              >
                <i className="fa fa-twitter text-[1.8rem] text-[#27295b] group-hover:text-white transition-colors duration-300"></i>
              </a>
              <a 
                href="https://www.instagram.com/busyplace_fr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#1CBE93] group transition-colors duration-300"
              >
                <i className="fa fa-instagram text-[1.8rem] text-[#27295b] group-hover:text-white transition-colors duration-300"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
