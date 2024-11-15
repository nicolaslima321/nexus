import { Table } from "~/components/common";

export default function SurvivorsPage() {
  const survivor = { name: 'nicolas', infected: true, iventory: ['watter'] };
  const survivors = new Array({ length: 30 }).fill(survivor);

  const tableHeaders = [
    'lorem',
    'ipsum',
    'dolor',
    'amet',
  ];

  const baseItem = [
    'lorem ipsum dolor sit amet',
    'ipsum',
    'dolor',
    'amet',
  ];

  const specialItem = [
    'Sekai ni itamio',
    'Shinra tensei',
    'Shinra tensei',
    'Shinra tensei',
  ];

  const tableItems = [];

  for (let i = 0; i < 30; i++) {
    if (i % 10 === 0) tableItems.push(specialItem);
    else tableItems.push(baseItem);
  }

  return (
    <Table tableHeaders={tableHeaders} tableItems={tableItems} />
  );
}
