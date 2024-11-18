const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const isEmailValid = (email: string) => emailRegex.test(email);

type Inventory = {
  name: string;
  quantity: number;
}

export const inventoryToString = (inventory: Inventory[]) => {
  if (inventory?.every(({ quantity }) => quantity == 0)) return 'None';

  const inventoryString = inventory.map(({ name, quantity }) => {
    if (quantity == 0) return;

    return `${quantity} ${name}`;
  }).join(', ');

  return inventoryString;
}
