// @ts-nocheck
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/animated-card";

interface Department {
  code: string;
  name: string;
  region_slug?: string;
  dpt_slug?: string;
  companiesCount?: number;
}

interface DepartmentsSectionProps {
  departments: Department[];
}

export function DepartmentsSection({ departments }: DepartmentsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(9);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, departments.length));
  };

  const visibleDepartments = departments.slice(0, visibleCount);

  return (
    <section className="bg-white p-8 sm:p-16 mb-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#27295b] mb-8 text-center">
          Annuaire des sociétés dans les département de France
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visibleDepartments.map((department, index) => (
            <AnimatedCard
              key={department.code}
              index={index}
              title={department.name}
              code={department.code}
              subtitle={`${department.companiesCount?.toLocaleString('fr-FR') || '0'} entreprises`}
              href={`/annuaires-entreprises/${department.region_slug || 'region'}/${department.dpt_slug || department.code}`}
            />
          ))}
        </div>
        {visibleCount < departments.length && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="px-6 py-2 text-[#27295b] hover:bg-gray-50"
              onClick={handleLoadMore}
            >
              Voir plus de départements
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
