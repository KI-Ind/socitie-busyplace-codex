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
            <table class="table th-color">
                <thead class="thead-light">
                    <tr>
                        <th class="th-color">Rôle</th>
                        <th class="th-color">Nom</th>
                        <th class="th-color">Occupe ce poste depuis</th>
                        <th class="th-color">Date de naissance</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.formality.content.personneMorale.composition.pouvoirs?.map(pouvoirs => `
                        <tr>
                            <td>${getRoles(pouvoirs.individu?.descriptionPersonne?.role) || ''}</td>
                            <td>
                                <font style="text-transform: capitalize;">${(pouvoirs.individu?.descriptionPersonne?.prenoms[0] || '').toLowerCase()}</font>
                                <font style="text-transform: uppercase;">${pouvoirs.individu?.descriptionPersonne?.nom || ''}</font>
                            </td>
                            <td>${formatDate(data.formality.content.natureCreation.dateCreation)}</td>
                            <td>${formatDate(pouvoirs.individu?.descriptionPersonne?.dateDeNaissance, 'MM/YYYY')}</td>
                        </tr>
                    `).join('') || ''}
                </tbody>
            </table>
        `;

        // Generate beneficiaries table (viewtbl2)
        const viewtbl2 = `
            <table class="table th-color">
                <thead class="thead-light">
                    <tr>
                        <th class="th-color">Nom</th>
                        <th class="th-color">Détention</th>
                        <th class="th-color">Date de naissance</th>
                        <th class="th-color">Nationalité</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.formality.content.personneMorale.beneficiairesEffectifs?.map(beneficiaire => `
                        <tr>
                            <td>
                                <font style="text-transform: capitalize;">${(beneficiaire.beneficiaire?.descriptionPersonne?.prenoms[0] || '').toLowerCase()}</font>
                                <font style="text-transform: uppercase;">${beneficiaire.beneficiaire?.descriptionPersonne?.nom || ''}</font>
                            </td>
                            <td>${beneficiaire.modalite?.detentionPartTotale || ''} %</td>
                            <td>${formatDate(beneficiaire.beneficiaire?.descriptionPersonne?.dateDeNaissance, 'MM/YYYY')}</td>
                            <td>${beneficiaire.beneficiaire?.descriptionPersonne?.nationalite || ''}</td>
                        </tr>
                    `).join('') || ''}
                </tbody>
            </table>
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
