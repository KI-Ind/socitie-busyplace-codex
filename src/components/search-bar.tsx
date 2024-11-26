'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 pl-4 pr-12 text-lg rounded-lg border border-gray-200 focus:outline-none focus:border-[#54cead] focus:ring-1 focus:ring-[#54cead]"
          placeholder="Nom d'entreprise, n° de SIREN…"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#54cead]"
        >
          <MagnifyingGlassIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <ul className="py-2">
            {results.map((result, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setQuery(result.name);
                  setResults([]);
                }}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
