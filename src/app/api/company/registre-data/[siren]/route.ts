// @ts-nocheck
import { NextResponse } from 'next/server';
import { currencyFormat, formatDate } from '@/utils/format';

async function registreentredata(siren: string) {
    // TODO: Replace with actual API call
    // This is mock data matching your API structure
    return {
        formality: {
            content: {
                personneMorale: {
                    adresseEntreprise: {
                        adresse: {
                            commune: 'PARIS',
                            codePostal: '75001'
                        }
                    },
                    identite: {
                        description: {
                            montantCapital: 50000
                        }
                    },
                    etablissementPrincipal: {
                        activites: [{
                            descriptionDetaillee: 'Commerce de détail en magasin'
                        }],
                        descriptionEtablissement: {
                            nomCommercial: 'Mon Magasin'
                        }
                    },
                    observations: {
                        rcs: [{
                            texte: 'Création de la société'
                        }]
                    }
                },
                natureCreation: {
                    dateCreation: '2023-01-01'
                }
            }
        }
    };
}

interface NewCity {
    area: string;
    zip_code: string;
}

// Mock city data - replace with actual database query
async function getCity(zipCode: string): Promise<NewCity | null> {
    // TODO: Replace with actual database query
    return {
        area: 'PARIS',
        zip_code: zipCode
    };
}

export async function GET(
    request: Request,
    { params }: { params: { siren: string } }
) {
    try {
        console.log('Registre data API called for SIREN:', params.siren);
        
        const sirenNumber = params.siren.replace(/\s/g, '').substring(0, 9);
        const data = await registreentredata(sirenNumber);
        
        // Process the data similar to Laravel implementation
        const commune = data.formality.content.personneMorale.adresseEntreprise.adresse.commune;
        const codePostal = data.formality.content.personneMorale.adresseEntreprise.adresse.codePostal;
        const newCity = await getCity(codePostal);
        
        const dateCreation = data.formality.content.natureCreation.dateCreation;
        const cityData = `${newCity?.area || commune}, le ${formatDate(dateCreation)}`;
        
        const socialCapital = currencyFormat('fr', data.formality.content.personneMorale.identite.description.montantCapital) + ' €';
        
        let observationRcs = null;
        let termination = "";
        const activitePrincipale = data.formality.content.personneMorale.etablissementPrincipal?.activites[0]?.descriptionDetaillee;
        
        let nomCommercial = data.formality.content.personneMorale.etablissementPrincipal?.descriptionEtablissement?.nomCommercial;
        if (nomCommercial) {
            nomCommercial = `(${nomCommercial})`;
        }

        let inscrit = `INSCRIT <span><i class="fa fa-check-circle-o" aria-hidden="true" 
            style="color: #54cead;"></i></span> Au greffe de 
            <font id="regdatagreffe">${cityData}</font>
            <font id="observationrcs">${observationRcs || ''}</font>`;

        // Handle company termination if exists
        if (data.formality.content.personneMorale.detailCessationEntreprise) {
            const cessationData = data.formality.content.personneMorale.detailCessationEntreprise;
            const observations = data.formality.content.personneMorale.observations?.rcs;
            
            if (observations && observations.length > 0) {
                observationRcs = `( ${observations[0].texte} )`;
            }

            termination = `(Radiée depuis le ${formatDate(cessationData.dateRadiation)})`;
            
            inscrit = `RADIÉ <span><i class="fa fa-times" aria-hidden="true" 
                style="color: red;"></i></span> le
                <font id="regdatagreffe">${formatDate(cessationData.dateRadiation)}</font>
                <br>
                <font id="observationrcs">${observationRcs || ''}</font>`;
        }

        // Handle RCS observations
        const rcsObservationList = data.formality.content.personneMorale.observations?.rcs;
        if (rcsObservationList) {
            inscrit += '<br><u><a style="cursor:pointer" data-toggle="modal" data-target="#observationsModal"><i class="fa fa-sticky-note-o"></i> Voir observations du greffe</a></u>';
        }

        // Generate the table views
        const viewtbl1 = `
            <table class="min-w-full divide-y divide-gray-200">
                <tr>
                    <th class="px-4 py-2 text-left">Date</th>
                    <th class="px-4 py-2 text-left">Type</th>
                    <th class="px-4 py-2 text-left">Détails</th>
                </tr>
                <tr>
                    <td class="px-4 py-2">${formatDate(dateCreation)}</td>
                    <td class="px-4 py-2">Création</td>
                    <td class="px-4 py-2">Création de l'entreprise</td>
                </tr>
            </table>
        `;

        const viewtbl2 = `
            <table class="min-w-full divide-y divide-gray-200">
                <tr>
                    <th class="px-4 py-2 text-left">Information</th>
                    <th class="px-4 py-2 text-left">Valeur</th>
                </tr>
                <tr>
                    <td class="px-4 py-2">Capital Social</td>
                    <td class="px-4 py-2">${socialCapital}</td>
                </tr>
            </table>
        `;

        const viewtbl3 = rcsObservationList ? `
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Observations du greffe</h5>
                </div>
                <div class="modal-body">
                    ${rcsObservationList.map(obs => `<p>${obs.texte}</p>`).join('')}
                </div>
            </div>
        ` : '';

        return NextResponse.json({
            viewtbl3,
            inscrit,
            nomcommercial: nomCommercial,
            activitepricipale: activitePrincipale,
            termination,
            observation_rcs: observationRcs,
            city_data: cityData,
            viewtbl1,
            viewtbl2,
            social_capital: socialCapital
        });

    } catch (error) {
        console.error('Error in registre data API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch registre data' },
            { status: 500 }
        );
    }
}
