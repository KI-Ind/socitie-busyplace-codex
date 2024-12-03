import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { AnimatedCard } from "@/components/animated-card";
import { getHomeData } from '@/lib/api/regions';
import { HomeData } from '@/lib/types/region';

export default async function Home() {
  let regions = [];
  let departments = [];
  try {
    const data: HomeData = await getHomeData();
    regions = data.regions.length > 0 ? data.regions : [
      { name: "Île-de-France", count: "245,678" },
      { name: "Auvergne-Rhône-Alpes", count: "185,432" },
      { name: "Provence-Alpes-Côte d'Azur", count: "156,789" },
      { name: "Occitanie", count: "134,567" },
      { name: "Nouvelle-Aquitaine", count: "123,456" },
      { name: "Hauts-de-France", count: "112,345" },
    ];
    departments = data.departments || [];
  } catch (error) {
    console.error('Error loading home data:', error);
    regions = [
      { name: "Île-de-France", count: "245,678" },
      { name: "Auvergne-Rhône-Alpes", count: "185,432" },
      { name: "Provence-Alpes-Côte d'Azur", count: "156,789" },
      { name: "Occitanie", count: "134,567" },
      { name: "Nouvelle-Aquitaine", count: "123,456" },
      { name: "Hauts-de-France", count: "112,345" },
    ];
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[aliceblue] pt-40 pb-32 px-8 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#27295b]">
                Toute l'information financière et légale au bout des doigts…
              </h1>
              <p className="text-lg text-gray-600">
                Collectez gratuitement toutes les informations nécessaires sur les
                sociétés de votre choix (statuts, PV d'assemblée générale, comptes sociaux, 
                dirigeants ..). Affinez votre analyse avec notre moteur de recherche avancé.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/home_new.svg"
                alt="Business Illustration"
                width={500}
                height={400}
                priority
                className="w-full max-w-[12rem] hidden lg:block"
              />
            </div>
          </div>
        </div>

        {/* Search Section - Positioned absolutely */}
        <div className="absolute left-0 right-0 bottom-0 translate-y-1/2">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Added top padding to account for search bar */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#27295b]">
                Plus de mille utilisateurs nous font <span className="underline">confiance!</span>
              </h2>
            </div>
            <div className="space-y-8">
              <Image
                src="/images/cmb-references-1.svg"
                alt="References 1"
                width={400}
                height={100}
                className="w-full"
              />
              <Image
                src="/images/cmb-references-2.svg"
                alt="References 2"
                width={400}
                height={100}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" id="services">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <Image
                src="/images/svg/main-left.svg"
                alt="Surveillance Feature"
                width={400}
                height={400}
                className="w-full max-w-[12rem]"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#27295b]">
                Surveiller des entreprises gratuitement
              </h2>
              <p className="text-lg text-gray-600">
                Contrôle MaBoite vous permet de surveiller des établissements gratuitement 
                en utilisant les différents connecteurs. Ils vous permettent de recevoir 
                des alertes par email à chaque fois qu'une information importante est publiée.
              </p>
              <Button className="bg-[#54cead] hover:bg-[#54cead]/90 px-[30px]">
                Commencer la surveillance
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Region Section */}
      <section className="services-bg py-16" id="region">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Annuaire des sociétés dans les régions de France
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {regions.map((region, index) => (
              <AnimatedCard
                key={region.name}
                index={index}
                title={region.name}
                subtitle={`${region.count || (region.companiesCount?.toLocaleString('fr-FR') || '0')} entreprises`}
                href={`/annuaires-entreprises/${region.slug || region.name.toLowerCase().replace(/ /g, '-')}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Companies Section */}
      <section className="bg-white p-8 sm:p-16 mb-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#27295b] mb-8 text-center">
            Annuaire des sociétés dans les département de France
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {departments.map((department, index) => (
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
        </div>
      </section>

      {/* Technologies Section */}
      <section className="services-bg" id="newDiv">
        <div className="services-bg-img">
          <div className="container mx-auto px-4 py-16">
            <header className="section-header mb-12">
              <h3 className="text-3xl font-bold text-white text-center">Nos technologies</h3>
            </header>

            <div className="space-y-12">
              {[
                {
                  icon: "/images/svg/icon5.svg",
                  title: "Web crawling",
                  description: "Nous avons développé des algorithmes capables d'explorer des centaines de milliers de pages web en peu de temps pour en extraire les données dont nous avons besoin. Nous parcourons les informations publiées par les entreprises et l'open data relative à leurs activités pour collecter les données qui seront par la suite explorées pour créer des profils complets."
                },
                {
                  icon: "/images/svg/icon6.svg",
                  title: "Matching",
                  description: "Pour créer des profils beaucoup plus complets, nous agrégeons des données de provenance de centaines de sources et les attacherons au profil de la société. Cette technique nous permet de rechercher toutes les informations disponibles sur une société et les rassembler dans un seul lieu. Le matching nous permet de vous proposer des informations sûres et complètes."
                },
                {
                  icon: "/images/svg/icon7.svg",
                  title: "Data mining",
                  description: "Nous implémentons les technologies de data mining qui nous permettent d'analyser les données collectées selon de nombreuses perspectives pour en tirer les informations utiles. Cette exploration des données est réalisée par nos algorithmes à la pointe de la technologie qui nous permettent de vous proposer des informations pertinentes et exactes sur les entreprises."
                },
                {
                  icon: "/images/svg/icon8.svg",
                  title: "Machine learning",
                  description: "Nous déployons des technologies d'intelligence artificielle permettant à nos algorithmes d'évoluer grâce au machine learning. Ces technologies nous permettent de vous proposer des informations beaucoup plus pertinentes et de prendre de l'avance sur nos concurrents. Contrôle Maboite utilise des technologies de pointe pour vous proposer les meilleures prestations."
                }
              ].map((tech, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center wow bounceInUp">
                  <div className="md:col-span-4 flex justify-center">
                    <Image
                      src={tech.icon}
                      alt={tech.title}
                      width={100}
                      height={100}
                      className="img-fluid img-bg-g"
                    />
                  </div>
                  <div className="md:col-span-8">
                    <h5 className="text-xl font-bold text-white mb-4">
                      <a href="#" className="hover:text-gray-200">{tech.title}</a>
                    </h5>
                    <p className="text-white/90 text-justify">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
