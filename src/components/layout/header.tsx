// @ts-nocheck
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { PhoneIcon } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/newlogo.svg"
              alt="BusyPlace Logo"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <Cross1Icon className="h-6 w-6" />
            ) : (
              <HamburgerMenuIcon className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className={`
            md:flex items-center justify-between flex-grow ml-8
            ${isMenuOpen ? 'block absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t' : 'hidden'}
            md:relative md:bg-transparent md:shadow-none md:p-0 md:border-none
          `}>
            {/* Main Navigation Links */}
            <ul className="md:flex space-y-4 md:space-y-0 md:space-x-8">
              <li>
                <Link 
                  href="https://busyplace.fr/nos-solutions"
                  className="text-[17px] text-gray-700 hover:text-[#1CBE93] transition-colors font-normal"
                >
                  Nos formulaires
                </Link>
              </li>
              <li>
                <Link 
                  href="https://busyplace.fr/nos-avantages"
                  className="text-[17px] text-gray-700 hover:text-[#1CBE93] transition-colors font-normal"
                >
                  Journaux habilités
                </Link>
              </li>
              <li className="relative">
                <button
                  className="flex items-center text-[17px] text-gray-700 hover:text-[#1CBE93] transition-colors font-normal"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Annuaires
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2">
                    <Link href="https://busyplace.fr/greffes" className="block px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 font-normal">
                      Greffes de France
                    </Link>
                    <Link href="https://busyplace.fr/experts-comptables" className="block px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 font-normal">
                      Experts-comptables
                    </Link>
                    <Link href="https://busyplace.fr/avocats" className="block px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 font-normal">
                      Avocats
                    </Link>
                    <Link href="https://busyplace.fr/notaires" className="block px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 font-normal">
                      Notaires
                    </Link>
                    <Link href="https://busyplace.fr/recherche-annonces-legales" className="block px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 font-normal">
                      Recherche des annonces légales
                    </Link>
                  </div>
                )}
              </li>
            </ul>

            {/* Right Side Items */}
            <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-8 mt-4 md:mt-0">
              {/* Phone Number */}
              <Link 
                href="tel:01 76 35 05 33"
                className="hidden xl:flex items-center text-gray-700 hover:text-[#1CBE93] transition-colors"
              >
                <PhoneIcon className="w-6 h-6 text-[#1CBE93] fill-[#1CBE93] mr-2" strokeWidth={2} />
                <span className="text-[16px] font-normal">01 53 65 16 66</span>
              </Link>

              {/* Login Link */}
              <Link 
                href="https://busyplace.fr/connexion"
                className="flex items-center text-gray-700 hover:text-[#1CBE93] transition-colors"
              >
                <svg 
                  className="w-6 h-6 text-[#1CBE93] mr-2" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span className="text-[16px] font-normal">Se connecter</span>
              </Link>

              {/* Professional Button */}
              <Button
                href="https://app.busyplace.fr/professionnels"
                className="bg-[rgb(39,41,91)] hover:bg-[rgb(35,37,82)] text-[#FFFFFF] px-6 py-2.5 h-auto rounded-md flex flex-col"
              >
                <span className="text-[17px] font-medium whitespace-nowrap">Professionnels</span>
                <span className="text-[13px] font-normal whitespace-nowrap opacity-80">Avocats, Experts-comptables, Notaires</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
