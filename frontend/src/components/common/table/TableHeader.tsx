type ITableHeaderCell = string;

interface ITableHeader {
  headerItems: ITableHeaderCell[];
};

export default function TableHeader({ headerItems }: ITableHeader) {

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {headerItems.map((label) => (
          <th key={label} scope="col" className="px-6 py-3">
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
