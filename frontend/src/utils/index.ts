const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const isEmailValid = (email: string) => emailRegex.test(email);

type Inventory = {
  name: string;
  quantity: number;
};

export const inventoryToString = (inventory: Inventory[]) => {
  if (inventory?.every(({ quantity }) => quantity == 0)) return "None";

  const inventoryStrings = inventory
    .filter(({ quantity }) => Number(quantity) > 0)
    .map(({ name, quantity }) => {
      return `${quantity} ${name}`;
    });

  if (inventoryStrings.length == 1) return inventoryStrings[0];

  return inventoryStrings.join(", ");
};
