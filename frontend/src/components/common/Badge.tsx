interface IBadge {
  text: string,
  color: string,
}

export default function Badge({ text, color = 'grey' }: IBadge) {
  const colorClass = `bg-${color}-100 text-${color}-800 text-xs font-medium font-bold px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300`;

  return <span className={colorClass}>{text}</span>;
};
