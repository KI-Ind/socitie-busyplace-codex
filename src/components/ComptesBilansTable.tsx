import React from 'react';

interface BilanSaisi {
  dateCloture: string;
  bilanSaisi: {
    bilan: {
      detail: {
        pages: Array<{
          liasses: Array<{
            code: string;
            m1: string;
            m3?: string;
          }>;
        }>;
      };
    };
  };
}

interface Props {
  data: {
    bilansSaisis?: BilanSaisi[];
  };
}

export function ComptesBilansTable({ data }: Props) {
  if (!data?.bilansSaisis?.length) {
    return <div className="text-center text-gray-500">Aucun bilan disponible</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date de clôture
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Chiffre d'affaires
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Résultat net
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.bilansSaisis.map((bilan, index) => {
          let revenueValue = '';
          let incomeValue = '';

          bilan.bilanSaisi.bilan.detail.pages.forEach(page => {
            page.liasses.forEach(liasse => {
              if (['FJ', '218', '232'].includes(liasse.code)) {
                revenueValue = liasse.m3 || liasse.m1;
              }
              if (['HN', 'DI', '310'].includes(liasse.code)) {
                incomeValue = liasse.m1;
              }
            });
          });

          return (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(bilan.dateCloture).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseInt(revenueValue) || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseInt(incomeValue) || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => window.open(`/api/download/file/COMPTESANNUELS?date=${bilan.dateCloture}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <i className="fa fa-download mr-2"></i>
                  Télécharger
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
