import React from "react";

interface ITextInput {
  id: string;
  name: string;
  placeholder: string;
  type: string;
  value: string | number;
  onChange: () => void;
};

export default function TextInput({ id, type, name, placeholder, onChange, value }: ITextInput) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{name}</label>
      <input onChange={onChange} type={type} name={name} id={id} placeholder={placeholder} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value={value} required />
    </div>
  );
};
