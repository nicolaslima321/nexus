import Tooltip from "./Tooltip";

interface IIconButton {
  tooltipText: string;
  icon: any;
  color: string;
  onClick: () => void;
}

export default function IconButton({
  tooltipText = "",
  icon,
  color,
  onClick,
}: IIconButton) {
  const getColorClass = () => {
    switch (color) {
      case "blue":
        return "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
      case "red":
        return "bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800";
      case "green":
        return "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
      case "gray":
      default:
        return "bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800";
    }
  };

  return (
    <Tooltip text={tooltipText}>
      <button
        type="button"
        onClick={onClick}
        className={`text-white focus:ring-1 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 ${getColorClass()}`}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
