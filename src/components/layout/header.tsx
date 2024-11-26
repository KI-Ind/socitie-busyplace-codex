'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, Cross1Icon, HamburgerMenuIcon, PersonIcon } from '@radix-ui/react-icons';
import { PhoneIcon } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/newlogo.svg"
              alt="BusyPlace Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
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
                  href="https://www.busyplace.fr/nos-formulaires"
                  className="text-gray-700 hover:text-[#1CBE93] transition-colors"
                >
                  Nos formulaires
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.busyplace.fr/journaux-habilites"
                  className="text-gray-700 hover:text-[#1CBE93] transition-colors"
                >
                  Journaux habilités
                </Link>
              </li>
              <li className="relative">
                <button
                  className="flex items-center text-gray-700 hover:text-[#1CBE93] transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Annuaires
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2">
                    <Link href="https://www.busyplace.fr/greffes-de-france" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Greffes de France
                    </Link>
                    <Link href="https://www.busyplace.fr/experts-comptables" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Experts-comptables
                    </Link>
                    <Link href="https://www.busyplace.fr/avocats" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Avocats
                    </Link>
                    <Link href="https://www.busyplace.fr/notaires" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Notaires
                    </Link>
                    <Link href="https://www.busyplace.fr/recherche-des-annoces-legales" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Recherche des annonces légales
                    </Link>
                  </div>
                )}
              </li>
            </ul>

            {/* Right Side Items */}
            <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
              {/* Login Link */}
              <Link 
                href="/login"
                className="flex items-center text-gray-700 hover:text-[#1CBE93] transition-colors"
              >
                <PersonIcon className="w-8 h-8 text-[#1CBE93] mr-2" />
                <span>Se connecter</span>
              </Link>

              {/* Phone Number */}
              <Link 
                href="tel:01 53 65 16 66"
                className="hidden xl:flex items-center text-gray-700 hover:text-[#1CBE93] transition-colors"
              >
                <PhoneIcon className="w-8 h-8 text-[#1CBE93] mr-2" />
                <span>01 53 65 16 66</span>
              </Link>

              {/* Professional Button */}
              <Button
                variant="professional"
                size="lg"
                className="flex flex-col items-center"
              >
                <span className="text-lg font-bold">Professionnels</span>
                <span className="text-xs">Avocats, Experts-comptables, Notaires</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
