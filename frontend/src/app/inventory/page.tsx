"use client";

import { Table } from "~/components/common";
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Title from "~/components/common/Title";
import { ISurvivor } from "~/interfaces";
import Avatar from "~/components/common/Avatar";
import IconButton from "~/components/common/IconButton";
import Tooltip from "~/components/common/Tooltip";
import { inventoryToString } from "~/utils";
import Modal from "~/components/common/Modal";
import ItemModal from "~/components/modals/ItemModal";
import ItemExchangeModal from "~/components/modals/ItemExchangeModal";
import Button from "~/components/common/Button";
import { useAuth } from "~/contexts/SurvivorContext";
import { useNotification } from "~/contexts/NotificationContext";

export default function SurvivorsPage() {
  const { storedSurvivor } = useAuth();
  const { notify } = useNotification();

  const [survivors, setSurvivors] = useState<ISurvivor[]>([]);
  const [currentSurvivor, setCurrentSurvivor] = useState<ISurvivor>({});

  const [itemObject, setItemObject] = useState({});

  const [openItemAddModal, setOpenItemAddModal] = useState(false);
  const [openItemExchangeModal, setOpenItemExchangeModal] = useState(false);

  const ModalFooter = () => {
    return (
      <div className="flex justify-end gap-4">
        <Button disabled={Object.values(itemObject).some((value) => !Boolean(value))} className="h-8 text-xs sm:text-md flex items-center bg-purple hover:bg-dark-purple dark:bg-gray-700 dark:hover:bg-gray-800" onClick={openItemAddModal ? () => performAdd(currentSurvivor.id, itemObject) : () => performExchange(currentSurvivor.id, itemObject)} text="Save" />
        <Button className="h-8 text-xs sm:text-md flex items-center bg-purple hover:bg-dark-purple dark:bg-gray-700 dark:hover:bg-gray-800" onClick={() => {
          setOpenItemAddModal(false);
          setOpenItemExchangeModal(false);
          }} text="Cancel" variant="secondary" />
      </div>
    );
  }

  const performAdd = async (survivorId, item) => {
    try {
      const payload = {
        itemId: item.id,
        quantity: item.quantity,
      };

      await axios.post(`/api/survivor/${survivorId}/inventory`, payload);

      notify('success', 'Item added successfully!');
    } catch (err) {
      notify('error', 'Failed to add item');
    }
  }

  const performExchange = async (survivorId, item) => {
    const payload = {
      survivorId,
      requesterSurvivorId: storedSurvivor!.id,
      itemToExchange: {
        itemId: item.id,
        quantity: item.quantity,
      },
    };

    try {
      await axios.post(`/api/survivor/exchange`, payload);
      notify('success', 'Item exchanged successfully!');
    } catch (err) {
      if (err.status === 400) {
        notify('error', 'The amount of item requested is greater than the amount available, or is invalid');
      } else if (err.status === 422) {
        notify('error', 'Cannot exchange items with yourself');
      } else {
        notify('error', 'Failed to exchange item');
      }
    }
  };

  const handleActionClick = (action: 'add' | 'exchange', survivor) => {
    setCurrentSurvivor(survivor);

    if (action === 'add') {
      setOpenItemAddModal(true);
    } else {
      setOpenItemExchangeModal(true);
    }
  };

  const ExchangeIcon = (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
    </svg>
  );

  const AddIcon = (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
    </svg>
  );

  const NameCell = (key, survivor) => {
    return (
      <div key={key} className="inline-flex items-center gap-2">
        <Avatar />

        <p>{survivor.name}</p>
      </div>
    );
  };

  const InventoryCell = (key, survivor) => {
    return (
      <div key={key}>
        <Tooltip text={inventoryToString(survivor.inventory)}>
          <div className="inline-flex items-center gap-2">
            {inventoryToString(survivor.inventory)}
          </div>
        </Tooltip>
      </div>
    );
  };

  const Action = (key, survivor) => {
    return (
      <div key={key}>
        <IconButton onClick={() => handleActionClick('add', survivor)} tooltipText="Add item" icon={AddIcon} />
        <IconButton onClick={() => handleActionClick('exchange', survivor)} tooltipText="Request item" icon={ExchangeIcon} />
      </div>
    );
  };

  const survivorTableHeaders = [
    'Name',
    'Inventory',
    'Action',
  ];

  const mapSurvivorInventory = (survivor) => {
    const invItems = survivor?.inventory?.inventoryItems || [];

    const mappedInvItems = invItems.map(({ item, quantity }) => {
      return {
        ...item,
        quantity,
      }
    });

    return mappedInvItems;
  }

  const survivorTableItems = useMemo(() => {
    if (!survivors || survivors.length === 0) return [];

    const formattedSurvivors = survivors.map((survivor) => {
      return {
        ...survivor,
        inventory: mapSurvivorInventory(survivor),
      };
    });

    const survivorsToRender = formattedSurvivors.map((survivor, index) => {
      return [
        NameCell(index, survivor),
        InventoryCell(index, survivor),
        Action(index, survivor),
      ];
    });

    return survivorsToRender;
  }, [survivors]);

  const survivorsInventoryCount = useMemo(() => {
    if (!survivors || survivors.length === 0) return 0;

    const mapQuantityPerInventory = (survivor) =>
      survivor?.inventory?.inventoryItems?.map(({ quantity }) => Number(quantity))
      ?.reduce((acc, curr) => acc + curr, 0) || 0;

    return survivors.map(mapQuantityPerInventory).reduce((acc, curr) => acc + curr, 0);
  }, [survivors]);

  const onUpdateItemObject = (key, value) => setItemObject({ ...itemObject, [key]: value });

  useEffect(() => {
    const fetchSurvivors = async () => {
      const { data: survivorsList } = await axios.get('/api/survivor');

      setSurvivors(survivorsList);
    };

    fetchSurvivors();
  }, []);

  return (
    <div>
      <Modal
        title={openItemAddModal ? 'Add Item' : 'Exchange Item'}
        isOpen={openItemAddModal || openItemExchangeModal}
        footerContent={<ModalFooter />}
        onClose={() => {
          setOpenItemAddModal(false);
          setOpenItemExchangeModal(false);
        }}
      >
        {openItemAddModal && <ItemModal item={itemObject} onUpdateItem={onUpdateItemObject} />}
        {openItemExchangeModal && <ItemExchangeModal item={itemObject} survivorItems={currentSurvivor.inventory} onUpdateItem={onUpdateItemObject} />}
      </Modal>

      <div className="mb-6">
        <Title  variant="h3" text="List of Survivors"  />
        <p>You have {survivorsInventoryCount} healthy survivors</p>
      </div>

      <Table tableHeaders={survivorTableHeaders} tableItems={survivorTableItems} />
    </div>
  );
}
