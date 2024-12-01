'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface AnimatedCardProps {
  index: number;
  title: string;
  subtitle: string;
  href: string;
  code?: string;
}

export function AnimatedCard({ index, title, subtitle, href, code }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
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
            {title}
          </h3>
          {code && (
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium 
                          shadow-sm group-hover:bg-blue-100 transition-colors">
              {code}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">
            {subtitle}
          </p>
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
            asChild
          >
            <Link href={href}>
              Voir plus
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
