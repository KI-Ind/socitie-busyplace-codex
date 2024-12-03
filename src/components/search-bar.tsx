'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout>();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.length > 2) { // Only search if more than 2 characters
      setIsLoading(true);
      // Set a new timeout
      searchTimeout.current = setTimeout(async () => {
        try {
          const timestamp = Date.now();
          const response = await fetch(`/api/search/autocomplete?keyword=${encodeURIComponent(value)}&t=${timestamp}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
          });
          
          if (!response.ok) {
            throw new Error('Search request failed');
          }
          const data = await response.json();
          setResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300); // Debounce time of 300ms
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 3) return; // Only search if more than 2 characters

    setIsLoading(true);
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/search/autocomplete?keyword=${encodeURIComponent(query)}&t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: any) => {
    const companyName = result.label
      .split(' ')[0] // Take only the first word of the company name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace special characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // Extract only the first 9 digits (SIREN) from the number
    const siren = result.siren.toString().substring(0, 9);
    
    router.push(`/${companyName}/${siren}`);
    setShowResults(false);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('form')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative shadow-lg rounded-lg">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder="Nom d'entreprise, n° de SIREN..."
          className="w-full p-4 pl-4 bg-white rounded-lg focus:outline-none text-gray-600 placeholder-gray-300"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-6 bg-[#1CBE93] hover:bg-[#1CBE93]/90 text-white rounded-r-lg"
          aria-label="Search"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Search Results */}
      {showResults && (query.length > 0 || results.length > 0) && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-gray-500 text-center">
              Recherche en cours...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex justify-between items-center">
                    <span>{result.label}</span>
                    <span className="text-sm text-gray-500">{result.category}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {result.siren} - {result.codepostal}
                    {result.age_naiss && ` - ${result.age_naiss} ans`}
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length > 0 ? (
            <div className="p-4 text-gray-500 text-center">
              Aucun résultat trouvé
            </div>
          ) : null}
        </div>
      )}
    </form>
  );
}
