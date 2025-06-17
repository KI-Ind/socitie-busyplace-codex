// @ts-nocheck
import { NextResponse } from 'next/server';
import { formatDate } from '@/utils/format';
import { getRegistreData, getRoles } from '@/utils/registre-api';

export async function GET(
    request: Request,
    { params }: { params: { siren: string } }
) {
    try {
        const sirenNumber = params.siren.replace(/\s/g, '').substring(0, 9);
        const data = await getRegistreData(sirenNumber);

        // Generate representatives table (viewtbl1)
        const viewtbl1 = `
            <div class="overflow-hidden shadow-sm rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-id-badge text-gray-400 mr-2"></i>
                                    Rôle
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-user text-gray-400 mr-2"></i>
                                    Nom
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-calendar text-gray-400 mr-2"></i>
                                    Occupe ce poste depuis
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-birthday-cake text-gray-400 mr-2"></i>
                                    Date de naissance
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${data.formality.content.personneMorale.composition.pouvoirs?.map((pouvoirs, index) => `
                            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <span class="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                                            ${getRoles(pouvoirs.individu?.descriptionPersonne?.role) || ''}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                                                <i class="fa fa-user text-blue-500"></i>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                <font style="text-transform: capitalize;">${(pouvoirs.individu?.descriptionPersonne?.prenoms[0] || '').toLowerCase()}</font>
                                                <font style="text-transform: uppercase;" class="ml-1 font-semibold">${pouvoirs.individu?.descriptionPersonne?.nom || ''}</font>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center text-sm text-gray-600">
                                        <i class="fa fa-clock-o text-gray-400 mr-2"></i>
                                        ${formatDate(data.formality.content.natureCreation.dateCreation)}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center text-sm text-gray-600">
                                        <i class="fa fa-calendar-o text-gray-400 mr-2"></i>
                                        ${formatDate(pouvoirs.individu?.descriptionPersonne?.dateDeNaissance, 'MM/YYYY')}
                                    </div>
                                </td>
                            </tr>
                        `).join('') || ''}
                    </tbody>
                </table>
            </div>
        `;

        // Generate beneficiaries table (viewtbl2)
        const viewtbl2 = `
            <div class="overflow-hidden shadow-sm rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-user-circle text-gray-400 mr-2"></i>
                                    Nom
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-percent text-gray-400 mr-2"></i>
                                    Détention
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-calendar text-gray-400 mr-2"></i>
                                    Date de naissance
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <i class="fa fa-globe text-gray-400 mr-2"></i>
                                    Nationalité
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${data.formality.content.personneMorale.beneficiairesEffectifs?.map((beneficiaire, index) => `
                            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center">
                                                <i class="fa fa-user-circle text-green-500"></i>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                <font style="text-transform: capitalize;">${(beneficiaire.beneficiaire?.descriptionPersonne?.prenoms[0] || '').toLowerCase()}</font>
                                                <font style="text-transform: uppercase;" class="ml-1 font-semibold">${beneficiaire.beneficiaire?.descriptionPersonne?.nom || ''}</font>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                                        ${beneficiaire.modalite?.detentionPartTotale || ''} %
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center text-sm text-gray-600">
                                        <i class="fa fa-calendar-o text-gray-400 mr-2"></i>
                                        ${formatDate(beneficiaire.beneficiaire?.descriptionPersonne?.dateDeNaissance, 'MM/YYYY')}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center text-sm text-gray-600">
                                        <i class="fa fa-flag text-gray-400 mr-2"></i>
                                        ${beneficiaire.beneficiaire?.descriptionPersonne?.nationalite || ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('') || ''}
                    </tbody>
                </table>
            </div>
        `;

        // Generate observations modal content (viewtbl3)
        const observations = data.formality.content.personneMorale.observations?.rcs || [];
        const sortedObservations = [...observations].reverse();
        
        const viewtbl3 = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Observations du Greffe</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Observation</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedObservations.map(obs => `
                                    <tr>
                                        <td>${formatDate(obs.dateAjout)}</td>
                                        <td>${obs.texte}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        return NextResponse.json({
            viewtbl1,
            viewtbl2,
            viewtbl3,
            success: true,
            social_capital: data.formality.content.personneMorale.identite?.description?.montantCapital 
                ? `${new Intl.NumberFormat('fr-FR').format(data.formality.content.personneMorale.identite.description.montantCapital)} €`
                : '',
            activitepricipale: data.formality.content.personneMorale.etablissementPrincipal?.activites?.[0]?.descriptionDetaillee || 
                              data.formality.content.personneMorale.autresEtablissements?.[0]?.activites?.[0]?.descriptionDetaillee || ''
        });

    } catch (error) {
        console.error('Error in representatives API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch representatives data' },
            { status: 500 }
        );
    }
}
