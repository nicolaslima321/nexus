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

export default function SurvivorsPage() {
  const [survivors, setSurvivors] = useState<ISurvivor[]>([]);

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

  const Action = (key) => {
    return (
      <div>
        <IconButton tooltipText="Add item" icon={AddIcon} />
        <IconButton tooltipText="Request item" icon={ExchangeIcon} />
      </div>
    );
  };

  const survivorTableHeaders = [
    'Name',
    'Inventory',
    'Action',
  ];

  const survivorTableItems = useMemo(() => {
    if (!survivors || survivors.length === 0) return [];

    const formattedSurvivors = survivors.map((survivor) => {
      const invItems = survivor?.inventory?.inventoryItems || [];
      const mappedInvItems = invItems.map(({ item, quantity }) => {
        return {
          ...item,
          quantity,
        }
      });

      return {
        ...survivor,
        inventory: mappedInvItems,
      };
    });

    console.log(formattedSurvivors[0]);

    const survivorsToRender = formattedSurvivors.map((survivor, index) => {
      return [
        NameCell(index, survivor),
        InventoryCell(index, survivor),
        <Action key={index} survivor={survivor} />,
      ];
    });

    return survivorsToRender;
  }, [survivors]);

  useEffect(() => {
    const fetchSurvivors = async () => {
      const { data: survivorsList } = await axios.get('/api/survivor');

      setSurvivors(survivorsList);
    };

    fetchSurvivors();
  }, []);

  return (
    <div className="">
      <Title  variant="h3" text="List of Survivors"  />
      <p>You have {survivors.length} healthy survivors</p>

      <Table tableHeaders={survivorTableHeaders} tableItems={survivorTableItems} />
    </div>
  );
}
