interface IBadge {
  text: string;
  color: string;
}

export default function Badge({ text, color = "grey" }: IBadge) {
  const getColorClass = () => {
    switch (color) {
      case "green":
        return `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case "red":
        return `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      case "yellow":
        return `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case "blue":
        return `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case "gray":
      default:
        return `bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
  };

  return (
    <span
      className={`text-xs font-medium font-bold px-2.5 py-0.5 rounded ${getColorClass()}`}
    >
      {text}
    </span>
  );
}
