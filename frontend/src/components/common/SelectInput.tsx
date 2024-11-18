interface ISelectInput {
  id: string;
  name: string;
  type: string;
  options: { label: string | number; value: string | number }[];
  value: string | number;
  onChange: (e: any) => void;
}

export default function SelectInput({
  id,
  name,
  onChange,
  options,
  value,
}: ISelectInput) {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      onChange(e);
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {name}
      </label>
      <select
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        onChange={handleOnChange}
        value={value}
        disabled={options.length === 0}
      >
        <option className="hidden" selected value={0}>
          Select an option
        </option>
        {options.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
