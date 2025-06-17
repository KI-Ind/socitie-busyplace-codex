// @ts-nocheck
import React from 'react';

interface RegistreAttachment {
  id: string;
  dateDepot: string;
  typeRdd: Array<{
    typeActe: string;
  }>;
  description?: string;
}

interface Props {
  attachments: {
    actes?: RegistreAttachment[];
  };
}

export function RegistreAttachmentsTable({ attachments }: Props) {
  if (!attachments?.actes?.length) {
    return <div className="text-center text-gray-500">Aucun acte disponible</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {attachments.actes.map((acte) => (
          <tr key={acte.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(acte.dateDepot).toLocaleDateString('fr-FR')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {acte.typeRdd.map(type => type.typeActe).join(', ')}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {acte.description || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button
                onClick={() => window.open(`/api/download/file/COMPTESANNUELS?id=${acte.id}&type=actes`)}
                className="text-blue-600 hover:text-blue-800"
              >
                <i className="fa fa-download mr-2"></i>
                Télécharger
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
