import SelectInput from "../common/SelectInput";
import TextInput from "../common/TextInput";

export default function ItemModal({ item, onUpdateItem }) {
  const itemOptions = [
    { id: 1, description: 'Water', name: 'Water', },
    { id: 2, description: 'Food', name: 'Food', },
    { id: 3, description: 'Medication', name: 'Medication', },
    { id: 4, description: 'C-Virus Vaccine', name: 'C-Virus Vaccine', },
  ];

  const mappedOptions = itemOptions.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <div className="flex items-center sm:justify-center flex-wrap gap-6">
      <div className="w-full sm:w-5/12">
        <SelectInput
          id="item"
          name="Select the item to add"
          options={mappedOptions}
          value={item.id}
          onChange={(e) => onUpdateItem('id', e.target.value)}
        />
      </div>

      <div className="w-full sm:w-5/12">
        <TextInput
          id="quantity"
          name="Enter the amount of the desired item"
          placeholder="Enter the quantity"
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateItem('quantity', e.target.value)}
        />
      </div>
    </div>
  );
}