'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout>();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    console.log('=== SEARCH BAR DEBUG ===');
    console.log('1. Input changed:', value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim()) {
      setIsLoading(true);
      // Debounce the search
      searchTimeout.current = setTimeout(async () => {
        try {
          const timestamp = Date.now();
          const url = `/api/search/autocomplete?keyword=${encodeURIComponent(value)}&t=${timestamp}`;
          console.log('2. Making API request to:', url);
          const response = await fetch(url, {
            // Add headers to prevent caching
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
          });
          console.log('3. API response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers)
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API request failed:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText
            });
            throw new Error('Search request failed');
          }
          
          const data = await response.json();
          console.log('4. API response data:', data);
          setResults(data);
        } catch (error) {
          console.error('5. Error in search:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
          console.log('6. Search completed');
        }
      }, 300); // Wait 300ms after user stops typing
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

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
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full h-14 pl-4 pr-12 text-lg rounded-lg border border-gray-200 focus:outline-none focus:border-[#54cead] focus:ring-1 focus:ring-[#54cead]"
          placeholder="Nom d'entreprise, n° de SIREN…"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#54cead]"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#54cead]" />
          ) : (
            <MagnifyingGlassIcon className="w-6 h-6" />
          )}
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
                  setQuery(result.label);
                  setResults([]);
                }}
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
        </div>
      )}
    </form>
  );
}
