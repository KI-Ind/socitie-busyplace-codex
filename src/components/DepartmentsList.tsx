'use client';

import { useState } from 'react';
import { Department } from '@/lib/types/region';
import { motion } from 'framer-motion';

interface DepartmentsListProps {
  departments: Department[];
}

const DepartmentCard = ({ department, index }: { department: Department; index: number }) => {
  return (
    <motion.a
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      href={`/annuaires-entreprises/${department.region_slug}/${department.dpt_slug}`}
      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm 
                 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 
                 border border-gray-100 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 
                    transition-transform duration-300 group-hover:scale-150 opacity-20"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#27295b] group-hover:text-blue-600 
                       transition-colors line-clamp-1">
            {department.name}
          </h3>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium 
                        shadow-sm group-hover:bg-blue-100 transition-colors">
            {department.code}
          </span>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600 line-clamp-1">{department.region}</p>
          <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 
                        transition-colors">
            <span>Voir les entreprises</span>
            <svg 
              className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export default function DepartmentsList({ departments }: DepartmentsListProps) {
  const INITIAL_DISPLAY = 8;
  const LOAD_MORE_COUNT = 4;
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY);
  const [isLoading, setIsLoading] = useState(false);

  const displayedDepartments = departments.slice(0, displayCount);
  const hasMore = displayCount < departments.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay for smooth transition
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, departments.length));
      setIsLoading(false);
    }, 500);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {displayedDepartments.map((department, index) => (
          <DepartmentCard 
            key={department.code} 
            department={department} 
            index={index}
          />
        ))}
        {isLoading && [...Array(LOAD_MORE_COUNT)].map((_, i) => (
          <LoadingSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
      
      {hasMore && (
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 
                     rounded-lg transition-all duration-300 shadow-sm hover:shadow-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isLoading ? 'Chargement...' : 'Afficher plus de départements'}
            </span>
            <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 
                          transition-transform origin-left"></div>
          </button>
        </motion.div>
      )}
    </div>
  );
}
