'use client';

import { CompanyData } from '@/types/company';
import { formatSIREN, formatSIRET, calculateTVA, getEffectifLabel } from '@/utils/company';
import { getLegalFormLabel } from '@/utils/legal-forms';
import { getNafActivityLabel } from '@/utils/naf-codes';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import '@/styles/company-details.css';

const MapComponent = dynamic(() => import('./MapComponent'), {
  loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg" />
});

interface CompanyDetailsClientProps {
  data: CompanyData;
  siren: string;
}

export default function CompanyDetailsClient({ data, siren }: CompanyDetailsClientProps) {
  const headquarters = data.etablissements?.find(e => e.etablissementSiege);
  
  if (!headquarters) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
        <p>No information available for this company.</p>
      </div>
    );
  }

  const {
    uniteLegale,
    adresseEtablissement,
    siret,
    dateCreationEtablissement
  } = headquarters;

  const formattedSiren = formatSIREN(siren);
  const formattedSiret = formatSIRET(siret);
  const tvaNumber = calculateTVA(siren);

  const socialCapitalRef = useRef<HTMLDivElement>(null);
  const table1Ref = useRef<HTMLDivElement>(null);
  const table2Ref = useRef<HTMLDivElement>(null);
  const greffeRef = useRef<HTMLDivElement>(null);
  const observationRcsRef = useRef<HTMLDivElement>(null);
  const terminationRef = useRef<HTMLDivElement>(null);
  const activitePrincipaleRef = useRef<HTMLDivElement>(null);
  const nomCommercialRef = useRef<HTMLDivElement>(null);
  const inscritRef = useRef<HTMLDivElement>(null);
  const observationsModalRef = useRef<HTMLDivElement>(null);
  const button1Ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Initialize data fetching functions
    const getRegistreData = async () => {
        try {
            const response = await fetch(`/api/company/registre-data/${siren}`);
            const data = await response.json();
            
            if (data.error) {
                console.error('Error fetching registre data:', data.error);
                return;
            }

            // Update DOM elements with received data
            if (socialCapitalRef.current) socialCapitalRef.current.innerHTML = data.social_capital;
            if (table1Ref.current) table1Ref.current.innerHTML = data.viewtbl1;
            if (table2Ref.current) table2Ref.current.innerHTML = data.viewtbl2;
            if (greffeRef.current) greffeRef.current.innerHTML = data.city_data;
            if (observationRcsRef.current) observationRcsRef.current.innerHTML = data.observation_rcs || '';
            if (terminationRef.current) terminationRef.current.innerHTML = data.termination || '';
            if (activitePrincipaleRef.current) activitePrincipaleRef.current.innerHTML = data.activitepricipale || '';
            if (nomCommercialRef.current) nomCommercialRef.current.innerHTML = data.nomcommercial || '';
            if (inscritRef.current) inscritRef.current.innerHTML = data.inscrit;
            if (observationsModalRef.current) observationsModalRef.current.innerHTML = data.viewtbl3;

            // Show the button after data is loaded
            if (button1Ref.current) button1Ref.current.style.display = 'block';
        } catch (error) {
            console.error('Error in getRegistreData:', error);
        }
    };

    const registreentredataattachments = () => {
      fetch(`/api/company/attachments/${siren}`)
        .then(response => response.json())
        .then(data => {
          document.getElementById("mytable3")!.innerHTML = data.viewtbl1;
          document.getElementById("mytbl4")!.innerHTML = data.viewtbl2;

          if (data.my_years?.length > 0 && (window as any).Highcharts) {
            const options = {
              title: null,
              xAxis: {
                categories: data.my_years
              },
              credits: {
                enabled: false
              },
              series: [{
                name: "Chiffre d'affaires (€)",
                data: data.data_revenue
              },
              {
                name: "Résultat net (€)",
                data: data.data_income
              }]
            };
            (window as any).Highcharts.chart('chartContainer', options);
          }
        })
        .catch(console.error);
    };

    const bodacdata = () => {
      fetch(`/api/company/bodac/${siren}`)
        .then(response => response.json())
        .then(data => {
          document.getElementById("mytable5")!.innerHTML = data.viewtbl1;
        })
        .catch(console.error);
    };

    const getRepresentativesData = async () => {
      try {
        const response = await fetch(`/api/company/representatives/${siren}`);
        const data = await response.json();
        
        if (data.error) {
          console.error('Error fetching representatives data:', data.error);
          return;
        }

        // Update the tables with the fetched data
        const table1 = document.getElementById('mytable1');
        const table2 = document.getElementById('mytbl2');
        const socialCapitalElement = document.getElementById('social_capital');
        const activityElement = document.getElementById('activitepricipale');
        
        if (table1) table1.innerHTML = data.viewtbl1;
        if (table2) table2.innerHTML = data.viewtbl2;
        if (socialCapitalElement) socialCapitalElement.innerHTML = data.social_capital;
        if (activityElement) activityElement.innerHTML = data.activitepricipale;

      } catch (error) {
        console.error('Error:', error);
      }
    };

    getRegistreData();
    registreentredataattachments();
    bodacdata();
    getRepresentativesData();
  }, [siren]);

  return (
    <>
      <Script src="https://kit.fontawesome.com/yourcode.js" />
      <Script src="https://code.highcharts.com/highcharts.js" />
      <Script src="https://code.highcharts.com/modules/series-label.js" />
      <Script src="https://code.highcharts.com/modules/exporting.js" />
      <Script src="https://code.highcharts.com/modules/export-data.js" />
      <Script src="https://code.highcharts.com/modules/accessibility.js" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href={`/search/commune/${adresseEtablissement.libelleCommuneEtablissement}`} 
                    className="text-blue-600 hover:text-blue-800">
                {adresseEtablissement.libelleCommuneEtablissement}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-500">{uniteLegale.denominationUniteLegale}</li>
          </ol>
        </nav>

        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <div className="flex justify-center">
                <Image
                  src="/assets/images/Group248.png"
                  alt="Company Logo"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="md:col-span-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {uniteLegale.denominationUniteLegale}
              </h1>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {formattedSiren}
              </div>
              <p className="text-gray-600 flex items-center mb-2">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {adresseEtablissement.numeroVoieEtablissement} {adresseEtablissement.typeVoieEtablissement}{' '}
                {adresseEtablissement.libelleVoieEtablissement}
                <br />
                {adresseEtablissement.codePostalEtablissement} {adresseEtablissement.libelleCommuneEtablissement}, France
              </p>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="detial-contnt th-box mt-5">
          <h4 className="font-weight-bold th-color m-0 th-border-b">
            <span>Informations légales de :</span>
            <span> {uniteLegale.denominationUniteLegale}</span>
          </h4>
          <div className="pt-5 pb-5">
            <div className="table-responsive" style={{ padding: '50px' }}>
              <table className="table table-n th-color mobi-table">
                <tbody>
                  <tr>
                    <th className="th-color-grey" style={{ width: '35%' }}>N° SIREN :</th>
                    <td>
                      <span id="socity_sirencopy">{formattedSiren} &nbsp;&nbsp;</span>
                      <span>
                        <i 
                          className="fa fa-clone cursor-pointer" 
                          aria-hidden="true"
                          onClick={() => {
                            navigator.clipboard.writeText(siren);
                            const tooltip = document.getElementById('socity_sirencopytool');
                            if (tooltip) {
                              tooltip.textContent = 'Copié !';
                              setTimeout(() => { tooltip.textContent = ''; }, 2000);
                            }
                          }}
                        />
                        <span className="tooltiptext" id="socity_sirencopytool"></span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">N° SIRET (siège) :</th>
                    <td>
                      <span id="socity_siretcopy">{formattedSiret} &nbsp;&nbsp;</span>
                      <span>
                        <i 
                          className="fa fa-clone cursor-pointer" 
                          aria-hidden="true"
                          onClick={() => {
                            navigator.clipboard.writeText(siret);
                            const tooltip = document.getElementById('socity_siretcopytool');
                            if (tooltip) {
                              tooltip.textContent = 'Copié !';
                              setTimeout(() => { tooltip.textContent = ''; }, 2000);
                            }
                          }}
                        />
                        <span className="tooltiptext" id="socity_siretcopytool"></span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Adresse : </th>
                    <td>
                      {adresseEtablissement.numeroVoieEtablissement} {adresseEtablissement.typeVoieEtablissement}{' '}
                      {adresseEtablissement.libelleVoieEtablissement} {adresseEtablissement.codePostalEtablissement}{' '}
                      {adresseEtablissement.libelleCommuneEtablissement}, France
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Forme juridique :</th>
                    <td>{getLegalFormLabel(uniteLegale.categorieJuridiqueUniteLegale)}</td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Activité (Code NAF ou APE) :</th>
                    <td>
                      {uniteLegale.activitePrincipaleUniteLegale} - {getNafActivityLabel(uniteLegale.activitePrincipaleUniteLegale)}
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Activité principale Etablissement :</th>
                    <td id="activitepricipale">
                      <div className="loading-container">
                        <div className="loading-bar">
                          <div className="progress-bar"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">N° TVA UE :</th>
                    <td>
                      <span id="socity_tvacopy">{tvaNumber}</span>
                      <span>
                        <i 
                          className="fa fa-clone cursor-pointer" 
                          aria-hidden="true"
                          onClick={() => {
                            navigator.clipboard.writeText(tvaNumber);
                            const tooltip = document.getElementById('socity_tvacopytool');
                            if (tooltip) {
                              tooltip.textContent = 'Copié !';
                              setTimeout(() => { tooltip.textContent = ''; }, 2000);
                            }
                          }}
                        />
                        <span className="tooltiptext" id="socity_tvacopytool"></span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Tranche d'effectif salariés :</th>
                    <td>
                      {getEffectifLabel(uniteLegale.trancheEffectifsUniteLegale)}
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Date d'immatriculation :</th>
                    <td>{new Date(uniteLegale.dateCreationUniteLegale).toLocaleDateString('fr-FR')}</td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Capital social :</th>
                    <td id="social_capital">
                      <div className="loading-container">
                        <div className="loading-bar">
                          <div className="progress-bar"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Inscription au RCS :</th>
                    <td id="inscrit">
                      INSCRIT <span><i className="fa fa-check-circle-o" aria-hidden="true" style={{ color: '#54cead' }}></i></span> Au greffe de
                      <font id="regdatagreffe"></font>
                      <font id="observationrcs"></font>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="text-center mt-2 col-md-3" id="mybtn"></div>
              <div className="text-center mt-2 col-md-3" style={{ display: 'none' }} id="btn1">
                <button 
                  type="button" 
                  className="btn btn-th font-weight-bold"
                  onClick={() => window.open(`/download/${siren}`)}
                >
                  &nbsp;Télécharger Extrait busyplace <i className="fa fa-cloud-download" aria-hidden="true"></i>&nbsp;
                </button>
              </div>
              <div className="text-center mt-2 col-md-3">
                <button 
                  type="button" 
                  className="btn btn-th font-weight-bold"
                  onClick={() => window.open(`https://api-avis-situation-sirene.insee.fr/identification/pdf/${siret}`)}
                >
                  &nbsp;Télécharger l'Avis de SIRENE <i className="fa fa-cloud-download" aria-hidden="true"></i>&nbsp;
                </button>
              </div>
              <div className="text-center mt-2 col-md-3">
                <button 
                  type="button" 
                  className="btn btn-th font-weight-bold" 
                  id="inpidatadownload"
                >
                  &nbsp;Extrait d'immatriculation RCS <i className="fa fa-cloud-download" aria-hidden="true"></i>&nbsp;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Representatives Section */}
        <div className="detial-contnt th-box mt-5">
          <div className="float-lg-lefts">
            <h4 className="font-weight-bold th-color m-0 th-border-b">
              <span>Mandataires légaux de : </span>
              <span>{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>

          <div className="pt-5 pb-5">
            <p className="dirige mt-4 th-color">DIRIGEANTS</p>
            <div className="table-responsive" id="mytable1" style={{ padding: '50px', maxHeight: '500px' }}>
              <div className="loading-container">
                <div className="loading-bar">
                  <div className="progress-bar"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="float-lg-left">
            <h4 className="font-weight-bold th-color m-0 th-border-b">
              <span>Actionnaires et bénéficiaires effectifs de :</span>
              <span>{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>

          <div className="pt-5 pb-5">
            <div className="table-responsive" id="mytbl2" style={{ padding: '50px', maxHeight: '500px' }}>
              <div className="loading-container">
                <div className="loading-bar">
                  <div className="progress-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Data Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-6">
            Données financières
          </h2>
          <div id="chartContainer" className="w-full h-96" />
        </div>

        {/* Registry Data Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-6">
            Données du registre
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Capital Social</h3>
                <div ref={socialCapitalRef} className="text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Ville</h3>
                <div ref={greffeRef} className="text-gray-700" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Statut RCS</h3>
                <div ref={observationRcsRef} className="text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Date d'inscription</h3>
                <div ref={inscritRef} className="text-gray-700" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Nom Commercial</h3>
              <div ref={nomCommercialRef} className="text-gray-700" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Activité Principale</h3>
              <div ref={activitePrincipaleRef} className="text-gray-700" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Historique</h3>
              <div ref={table1Ref} className="overflow-x-auto" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Informations Complémentaires</h3>
              <div ref={table2Ref} className="overflow-x-auto" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Observations</h3>
              <div ref={observationsModalRef} className="text-gray-700" />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-6">
            Localisation
          </h2>
          <MapComponent address={adresseEtablissement} />
        </div>

        {/* BODAC Data Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-6">
            Annonces BODAC
          </h2>
          <div id="mytable5" />
        </div>

        {/* Secondary Establishments */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-6">
            Établissements secondaires
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SIRET
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.etablissements
                  .filter(e => !e.etablissementSiege)
                  .map((etablissement, index) => (
                    <tr key={etablissement.siret} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatSIRET(etablissement.siret)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {etablissement.adresseEtablissement.numeroVoieEtablissement}{' '}
                        {etablissement.adresseEtablissement.typeVoieEtablissement}{' '}
                        {etablissement.adresseEtablissement.libelleVoieEtablissement},{' '}
                        {etablissement.adresseEtablissement.codePostalEtablissement}{' '}
                        {etablissement.adresseEtablissement.libelleCommuneEtablissement}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(etablissement.dateCreationEtablissement).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
