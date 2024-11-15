import React from 'react';

type ITableRowCell = string[] | React.ReactNode[];

interface ITableBody {
  tableItems: ITableRowCell[];
};

export default function TableBody({ tableItems }: ITableBody) {
  return (
    <tbody>
      {tableItems.map((tableRowCells, index) => (
        <tr key={index} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
          {tableRowCells.map((cell, index) => (
            index === 0 ?
              <th key={`th-${index}`} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {cell}
              </th>
            :
              <td key={`row-${index}`} className="px-6 py-4">
                {cell}
              </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
