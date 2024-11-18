interface IInventoryItems {
  id: number;
  name: string;
  quantity: number | string;
}

interface IFormattedInventory {
  id: number;
  name: string;
}

export type IInventory = {
  id: number;
  inventoryItems?: IInventoryItems[];
} | IFormattedInventory
