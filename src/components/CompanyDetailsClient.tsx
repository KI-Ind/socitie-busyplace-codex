'use client';

import { CompanyData } from '@/types/company';
import { formatSIREN, formatSIRET, calculateTVA, getEffectifLabel } from '@/utils/company';
import { getLegalFormLabel } from '@/utils/legal-forms';
import { getNafActivityLabel } from '@/utils/naf-codes';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
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

  const [registreData, setRegistreData] = useState<any>(null);
  const [attachmentsData, setAttachmentsData] = useState<any>(null);
  const [bodacData, setBodacData] = useState<any>(null);
  const [representativesData, setRepresentativesData] = useState<any>(null);
  const [isLoadingRegistre, setIsLoadingRegistre] = useState(true);
  const [registreError, setRegistreError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoadingRegistre(true);
        setRegistreError(null);

        // Fetch registre data
        const registreResponse = await fetch(`/api/company/registre-data/${siren}`);
        const registreData = await registreResponse.json();
        if (!registreData.error) {
          setRegistreData(registreData);
        } else {
          console.error('Error fetching registre data:', registreData.error);
        }

        // Fetch attachments data
        const attachmentsResponse = await fetch(`/api/company/registre-attachments/${siren}`);
        if (attachmentsResponse.ok) {
          const attachmentsData = await attachmentsResponse.json();
          setAttachmentsData(attachmentsData);
          
          // Update chart if data exists
          if (attachmentsData.my_years?.length > 0 && 
              attachmentsData.data_revenue?.some(val => val !== null) && 
              attachmentsData.data_income?.some(val => val !== null) && 
              typeof Highcharts !== 'undefined') {
            const chartContainer = document.getElementById('chartContainer');
            if (chartContainer) {
              Highcharts.chart(chartContainer, {
                chart: {
                  type: 'line',
                  style: {
                    fontFamily: 'Arial, sans-serif'
                  }
                },
                title: {
                  text: null
                },
                xAxis: {
                  categories: attachmentsData.my_years,
                  title: {
                    text: 'Année'
                  }
                },
                yAxis: {
                  title: {
                    text: 'Montant (€)'
                  },
                  labels: {
                    formatter: function() {
                      return Intl.NumberFormat('fr-FR', {
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(this.value as number);
                    }
                  }
                },
                credits: {
                  enabled: false
                },
                tooltip: {
                  shared: true,
                  valuePrefix: '€',
                  valueDecimals: 0,
                  pointFormatter: function() {
                    return '<span style="color:' + this.color + '">\u25CF</span> ' +
                           this.series.name + ': <b>€' + 
                           Intl.NumberFormat('fr-FR').format(this.y as number) + '</b><br/>';
                  }
                },
                series: [
                  {
                    name: "Chiffre d'affaires",
                    data: attachmentsData.data_revenue,
                    color: '#2563eb'
                  },
                  {
                    name: "Résultat net",
                    data: attachmentsData.data_income,
                    color: '#059669'
                  }
                ],
                responsive: {
                  rules: [{
                    condition: {
                      maxWidth: 500
                    },
                    chartOptions: {
                      legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                      }
                    }
                  }]
                }
              });
            }
          }
        }

        // Fetch BODAC data
        const bodacResponse = await fetch(`/api/company/bodac/${siren}`);
        if (bodacResponse.ok) {
          const bodacData = await bodacResponse.json();
          console.log('BODACC Data:', bodacData); // Debug log
          setBodacData(bodacData);
        } else {
          console.error('Error fetching BODAC data:', await bodacResponse.text());
        }

        // Fetch representatives data
        const representativesResponse = await fetch(`/api/company/representatives/${siren}`);
        const representativesData = await representativesResponse.json();
        if (!representativesData.error) {
          setRepresentativesData(representativesData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setRegistreError('Failed to load data. Please try again later.');
      } finally {
        setIsLoadingRegistre(false);
      }
    };

    if (siren) {
      fetchAllData();
    }
  }, [siren]);

  // Render functions
  const renderLoadingState = () => (
    <div className="flex items-center justify-center p-4">
      <div className="loading-container">
        <div className="loading-bar">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center text-red-600 p-4">
      {registreError}
    </div>
  );

  return (
    <>
      <Script src="https://kit.fontawesome.com/yourcode.js" />
      <Script src="https://code.highcharts.com/highcharts.js" />
      <Script src="https://code.highcharts.com/modules/series-label.js" />
      <Script src="https://code.highcharts.com/modules/exporting.js" />
      <Script src="https://code.highcharts.com/modules/export-data.js" />
      <Script src="https://code.highcharts.com/modules/accessibility.js" />
      
      <div className="max-w-7xl mx-auto">
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="float-lg-left mb-4">
            <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
              <span>Informations légales de : </span>
              <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>
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
                      {adresseEtablissement.libelleVoieEtablissement}
                      <br />
                      {adresseEtablissement.codePostalEtablissement} {adresseEtablissement.libelleCommuneEtablissement}, France
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
                    <td>
                      {registreData?.activitepricipale || ''}
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
                    <td>
                      {registreData?.social_capital || ''}
                    </td>
                  </tr>
                  <tr>
                    <th className="th-color-grey">Inscription au RCS :</th>
                    <td id="inscrit">
                      INSCRIT <span><i className="fa fa-check-circle-o" aria-hidden="true" style={{ color: '#54cead' }}></i></span> Au greffe de
                      <font id="regdatagreffe">
                        {registreData?.city_data || ''}
                      </font>
                      <font id="observationrcs">
                        {registreData?.observation_rcs || ''}
                      </font>
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Header */}
          <div className="float-lg-left mb-4">
            <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
              <span>Mandataires légaux de : </span>
              <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>

          {/* Directors Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <i className="fa fa-user-tie text-gray-600 mr-2"></i>
              <h3 className="text-lg font-semibold text-gray-800">DIRIGEANTS</h3>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-inner">
              <div className="overflow-x-auto">
                <div className="table-responsive" id="mytable1" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <div dangerouslySetInnerHTML={{ __html: representativesData?.viewtbl1 || '' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Shareholders Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="float-lg-left mb-4">
              <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
                <span>Actionnaires et bénéficiaires effectifs de : </span>
                <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
              </h4>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-inner">
              <div className="overflow-x-auto">
                <div className="table-responsive" id="mytbl2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <div dangerouslySetInnerHTML={{ __html: representativesData?.viewtbl2 || '' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Les actes Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="float-lg-left mb-4">
            <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
              <span>Les actes de : </span>
              <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>
          <div className="pt-5 pb-4">
            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto', padding: '50px' }}>
              {registreError ? (
                renderError()
              ) : isLoadingRegistre ? (
                renderLoadingState()
              ) : (
                <div dangerouslySetInnerHTML={{ 
                  __html: attachmentsData?.viewtbl1 || '<div class="text-center">Aucune donnée disponible</div>' 
                }} />
              )}
            </div>
          </div>
        </div>

        {/* Les comptes Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="float-lg-left mb-4">
            <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
              <span>Les comptes de : </span>
              <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>
          <div className="pt-5 pb-5">
            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto', padding: '50px' }}>
              {registreError ? (
                renderError()
              ) : isLoadingRegistre ? (
                renderLoadingState()
              ) : (
                <div dangerouslySetInnerHTML={{ 
                  __html: attachmentsData?.viewtbl2 || '<div class="text-center">Aucune donnée disponible</div>' 
                }} />
              )}
            </div>
          </div>
          <div id="chartContainer" className="mt-8" style={{ minHeight: '400px' }} />
        </div>

        {/* BODACC Data Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="float-lg-left mb-4">
            <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
              <span>Les annonces BODACC de : </span>
              <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>

          <div className="pt-5 pb-5">
            <div className="overflow-x-auto" style={{ maxHeight: '500px' }}>
              {isLoadingRegistre ? (
                renderLoadingState()
              ) : bodacData?.records && bodacData.records.length > 0 ? (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Greffe</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Lien</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bodacData.records.map((record: any, index: number) => {
                      try {
                        const listepersonnes = JSON.parse(record.fields.listepersonnes);
                        const accounce_id = record.fields.id;
                        const announcementLink = `https://www.bodacc.fr/annonce/detail-annonce/${accounce_id.substring(0, 1)}/${accounce_id.substring(1, 10)}/${accounce_id.substring(10)}`;
                        
                        return (
                          <tr 
                            key={accounce_id}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {listepersonnes.personne.numeroImmatriculation.nomGreffeImmat}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(record.fields.dateparution).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {record.fields.familleavis.charAt(0).toUpperCase() + record.fields.familleavis.slice(1)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <a 
                                href={announcementLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Voir l'annonce
                              </a>
                            </td>
                          </tr>
                        );
                      } catch (error) {
                        console.error('Error processing BODACC record:', error);
                        return null;
                      }
                    }).filter(Boolean)}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Aucune annonce disponible
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Data Section */}
        {attachmentsData?.my_years?.length > 0 && 
         attachmentsData.data_revenue?.some(val => val !== null) && 
         attachmentsData.data_income?.some(val => val !== null) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="float-lg-left mb-4">
              <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
                <span>Données financières de : </span>
                <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
              </h4>
            </div>
            <div id="chartContainer" className="w-full h-96" />
          </div>
        )}

        {/* Secondary Establishments */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="float-lg-left mb-4">
            <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
              <span>Les établissements de : </span>
              <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>

          <div className="pt-5 pb-5">
            <div className="overflow-x-auto" style={{ maxHeight: '500px' }}>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Nom</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Siret</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Adresse</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {data.etablissements.map((etablissement, index) => (
                    <tr 
                      key={etablissement.siret}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm">
                        <span className="font-medium text-gray-900">{uniteLegale.denominationUniteLegale}</span>
                        <br />
                        <span className="text-sm text-gray-500">
                          {etablissement.etablissementSiege ? '(siège)' : '(secondaire)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {formatSIRET(etablissement.siret)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-gray-500">Création</span>
                        <br />
                        <span className="text-gray-900">
                          {new Date(etablissement.dateCreationEtablissement).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-md">
                          {[
                            etablissement.adresseEtablissement.complementAdresseEtablissement,
                            etablissement.adresseEtablissement.numeroVoieEtablissement,
                            etablissement.adresseEtablissement.indiceRepetitionEtablissement,
                            etablissement.adresseEtablissement.typeVoieEtablissement,
                            etablissement.adresseEtablissement.libelleVoieEtablissement
                          ].filter(Boolean).join(' ')}
                          <br />
                          {etablissement.adresseEtablissement.codePostalEtablissement} {etablissement.adresseEtablissement.libelleCommuneEtablissement}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full font-medium ${
                          etablissement.periodesEtablissement[0]?.etatAdministratifEtablissement === 'A'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {etablissement.periodesEtablissement[0]?.etatAdministratifEtablissement === 'A' ? 'Actif' : 'Fermé'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact and Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="float-lg-left mb-4">
            <h4 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
              <span>Fiche d'identité de : </span>
              <span className="text-blue-600">{uniteLegale.denominationUniteLegale}</span>
            </h4>
          </div>

          <div className="pt-5 pb-5">
            <table className="min-w-full">
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 w-1/4">Téléphone:</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Non renseigné</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">Email :</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Non renseigné</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">Site Internet:</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Non renseigné</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">Adresse :</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {adresseEtablissement.numeroVoieEtablissement} {adresseEtablissement.typeVoieEtablissement}{' '}
                    {adresseEtablissement.libelleVoieEtablissement} {adresseEtablissement.codePostalEtablissement}{' '}
                    {adresseEtablissement.libelleCommuneEtablissement}, France
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full" style={{ height: '400px' }}>
            <MapComponent address={adresseEtablissement} />
          </div>
        </div>
      </div>
    </>
  );
}
