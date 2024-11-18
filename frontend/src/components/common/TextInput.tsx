import React from "react";

interface ITextInput {
  id: string;
  name: string;
  placeholder: string;
  type: string;
  value: string | number;
  hasError: boolean;
  errorText: string;
  onChange: () => void;
}

export default function TextInput({
  id,
  type,
  name,
  placeholder,
  onChange,
  value,
  errorText = "",
  hasError = false,
}: ITextInput) {
  const getErrorLabelClass = () => {
    if (!hasError) return "";

    return "text-red-700 dark:text-red-500";
  };

  const getErrorInputClass = () => {
    if (!hasError) return "";

    return "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
  };

  return (
    <div>
      <label
        htmlFor={id}
        className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${getErrorLabelClass()}`}
      >
        {name}
      </label>
      <input
        onChange={onChange}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${getErrorInputClass()}`}
        value={value}
        required
      />
      {Boolean(errorText && hasError) && (
        <span className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errorText}
        </span>
      )}
    </div>
  );
}
