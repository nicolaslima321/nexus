interface IButton {
  className?: string;
  text: string;
  disabled: boolean;
  onClick: () => void;
}

export default function Button({ className, text, disabled, onClick }: IButton) {
  return (
    <button
      className={`disabled:bg-gray-400 disabled:dark:bg-gray-400 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
