import { Button } from "@/components/ui/button";

export default function AnnuairesEntreprises() {
  const dummyDepartments = [
    { code: "75", name: "Paris", region_slug: "ile-de-france", dpt_slug: "paris" },
    { code: "69", name: "Rhône", region_slug: "auvergne-rhone-alpes", dpt_slug: "rhone" },
    { code: "13", name: "Bouches-du-Rhône", region_slug: "provence-alpes-cote-d-azur", dpt_slug: "bouches-du-rhone" },
    { code: "33", name: "Gironde", region_slug: "nouvelle-aquitaine", dpt_slug: "gironde" },
    { code: "59", name: "Nord", region_slug: "hauts-de-france", dpt_slug: "nord" },
    { code: "31", name: "Haute-Garonne", region_slug: "occitanie", dpt_slug: "haute-garonne" },
  ];

  const dummyCities = [
    { name: "Paris", zip_code: "75000", region_slug: "ile-de-france", dpt_slug: "paris", city_slug: "paris" },
    { name: "Lyon", zip_code: "69000", region_slug: "auvergne-rhone-alpes", dpt_slug: "rhone", city_slug: "lyon" },
    { name: "Marseille", zip_code: "13000", region_slug: "provence-alpes-cote-d-azur", dpt_slug: "bouches-du-rhone", city_slug: "marseille" },
    { name: "Bordeaux", zip_code: "33000", region_slug: "nouvelle-aquitaine", dpt_slug: "gironde", city_slug: "bordeaux" },
    { name: "Lille", zip_code: "59000", region_slug: "hauts-de-france", dpt_slug: "nord", city_slug: "lille" },
    { name: "Toulouse", zip_code: "31000", region_slug: "occitanie", dpt_slug: "haute-garonne", city_slug: "toulouse" },
  ];

  const dummyActivities = [
    { key: "commerce", name: "Commerce de détail" },
    { key: "restauration", name: "Restauration" },
    { key: "immobilier", name: "Immobilier" },
    { key: "construction", name: "Construction" },
    { key: "conseil", name: "Conseil et Services" },
    { key: "sante", name: "Santé" },
  ];

  const region = "Île-de-France";

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-8">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-[#27295b]">
                Toutes les sociétés de la région <span>({region})</span>
              </h2>

              {/* Departments Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#27295b]">
                  Les sociétés de la région ({region}) réparties par département:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {dummyDepartments.map((dept, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 text-left hover:bg-gray-50"
                      asChild
                    >
                      <a href={`/annuaires-entreprises/${dept.region_slug}/${dept.dpt_slug}`}>
                        {dept.code} - {dept.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cities Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#27295b]">
                  Les sociétés de la région ({region}) réparties par ville:
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
                  Les sociétés de la région ({region}) réparties par famille d'activités:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {dummyActivities.map((activity, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 text-left hover:bg-gray-50"
                      asChild
                    >
                      <a href={`/activites/${activity.key}`}>
                        {activity.name}
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
