// @ts-nocheck
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    region: string;
    department: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DepartmentPage({
  params,
  searchParams,
}: PageProps) {
  const department = "Paris"; // This would come from the API based on params.department
  
  const dummyCities = [
    { 
      name: "Paris 1er", 
      zip_code: "75001", 
      region_slug: params.region, 
      dpt_slug: params.department, 
      city_slug: "paris-1er" 
    },
    { 
      name: "Paris 2e", 
      zip_code: "75002", 
      region_slug: params.region, 
      dpt_slug: params.department, 
      city_slug: "paris-2e" 
    },
    { 
      name: "Paris 3e", 
      zip_code: "75003", 
      region_slug: params.region, 
      dpt_slug: params.department, 
      city_slug: "paris-3e" 
    },
    { 
      name: "Paris 4e", 
      zip_code: "75004", 
      region_slug: params.region, 
      dpt_slug: params.department, 
      city_slug: "paris-4e" 
    },
    { 
      name: "Paris 5e", 
      zip_code: "75005", 
      region_slug: params.region, 
      dpt_slug: params.department, 
      city_slug: "paris-5e" 
    },
    { 
      name: "Paris 6e", 
      zip_code: "75006", 
      region_slug: params.region, 
      dpt_slug: params.department, 
      city_slug: "paris-6e" 
    },
  ];

  const dummyActivities = [
    { 
      key: "restauration", 
      name: "Restaurants et services de restauration",
      count: 1250
    },
    { 
      key: "commerce-detail", 
      name: "Commerce de détail",
      count: 980
    },
    { 
      key: "services-entreprises", 
      name: "Services aux entreprises",
      count: 850
    },
    { 
      key: "immobilier", 
      name: "Activités immobilières",
      count: 720
    },
    { 
      key: "tech", 
      name: "Technologies et numérique",
      count: 650
    },
    { 
      key: "sante", 
      name: "Santé et action sociale",
      count: 580
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-8">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-[#27295b]">
                Toutes les sociétés du département <span>({department})</span>
              </h2>

              {/* Cities Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#27295b]">
                  Les sociétés du département ({department}) réparties par ville:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {dummyCities.map((city, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 text-left hover:bg-gray-50"
                      asChild
                    >
                      <a href={`/annuaires-entreprises/${city.region_slug}/${city.dpt_slug}/${city.city_slug}`}>
                        sociétés {city.name} ({city.zip_code})
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Activities Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#27295b]">
                  Les sociétés du département ({department}) réparties par famille d'activités:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {dummyActivities.map((activity, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 text-left hover:bg-gray-50"
                      asChild
                    >
                      <a href={`/activites/${activity.key}?department=${params.department}`}>
                        {activity.name} ({activity.count} entreprises)
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
