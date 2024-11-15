import Table from "~/components/common/Table";

export default function SurvivorsPage() {
  const survivor = { name: 'nicolas', infected: true, iventory: ['watter'] };
  const survivors = new Array({ length: 30 }).fill(survivor);

  const tableHeaders = [
    'lorem',
    'ipsum',
    'dolor',
    'amet',
  ];

  const tableItems = new Array({ length: 30 }).fill([
    'lorem ipsum dolor sit amet',
    'ipsum',
    'dolor',
    'amet',
  ]);

  return (
    <Table tableHeaders={tableHeaders} tableItems={tableItems} />
  );
}
