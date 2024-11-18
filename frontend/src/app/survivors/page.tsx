"use client";

import { Table } from "~/components/common";
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Title from "~/components/common/Title";
import { ISurvivor } from "~/interfaces";
import Avatar from "~/components/common/Avatar";
import { Badge } from "~/components";
import Button from "~/components/common/Button";
import Modal from "~/components/common/Modal";
import SurvivorModal from "~/components/modals/SurvivorModal";
import { useNotification } from "~/contexts/NotificationContext";

export default function SurvivorsPage() {
  const { notify } = useNotification();

  const [openModal, setOpenModal] = useState(false);

  const [survivors, setSurvivors] = useState<ISurvivor[]>([]);

  const [targetSurvivor, setTargetSurvivor] = useState<ISurvivor>({
    age: 0,
    name: '',
    gender: '',
    status: '',
    isInfected: false,
    latitude: 0,
    longitude: 0,
    /* This is a temporary solution to avoid the account creation step */
    skipAccountCreation: true,
  });

  const handleSave = async () => {
    const survivorData = {
      ...targetSurvivor,
      infected: targetSurvivor.isInfected,
      lastLocation: {
        latitude: targetSurvivor.latitude,
        longitude: targetSurvivor.longitude,
      },
    }

    try {
      await axios.post('/api/survivor', survivorData);

      notify('success', 'Survivor created successfully!');
    } catch(err) {
      console.error(err);
    }

    setOpenModal(false);
  };

  const disableSaveButton = () => {
    return Object.entries(targetSurvivor).some(([key, value]) => {
      if (key === 'isInfected' || key === 'skipAccountCreation') {
        return false;
      }

      return value == 0 || value === '';
    });
  }

  const ModalFooter = () => {
    return (
      <>
        <Button
          className="h-8 flex items-center bg-purple hover:bg-dark-purple dark:bg-gray-700 dark:hover:bg-gray-800 mr-4"
          text="Save Survivor"
          onClick={handleSave}
          disabled={disableSaveButton()}
        />

        <Button
          className="h-8 flex items-center bg-purple hover:bg-dark-purple dark:bg-gray-700 dark:hover:bg-gray-800"
          text="Close"
          onClick={() => setOpenModal(false)}
        />
      </>
    );
  }

  const AddIcon = (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
    </svg>
  );

  const NameTableCell = (key, survivor) => {
    return (
      <div key={key} className="inline-flex items-center gap-2">
        <Avatar />

        <p>{survivor.name}</p>
      </div>
    );
  };

  const StatusTableCell = (key, survivor) => {
    return (
      <div key={key}>
        <Badge
          text={survivor.infected ? 'Infected' : 'Healthy'}
          color={survivor.infected ? 'red' : 'green'}
        />
      </div>
    );
  };

  const CreationDataTableCell = (key, survivor) => {
    return (
      <div key={key}>
        {new Date(survivor.createdAt).toDateString()}
      </div>
    );
  };

  const survivorTableHeaders = [
    'Full Name',
    'Status',
    'Creation Date',
  ];

  const healthSurvivorsCount = useMemo(() => {
    if (!survivors || survivors.length === 0) return 0;

    return survivors.filter((survivor) => !survivor.infected).length;
  }, [survivors]);

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

    const survivorsToRender = formattedSurvivors.map((survivor, index) => {
      return [
        NameTableCell(index, survivor),
        StatusTableCell(index, survivor),
        CreationDataTableCell(index, survivor),
      ];
    });

    return survivorsToRender;
  }, [survivors]);

  const onUpdateSurvivor = (key: string, value: string | number | boolean) => {
    setTargetSurvivor({
      ...targetSurvivor,
      [key]: value,
    });
  };

  useEffect(() => {
    const fetchSurvivors = async () => {
      const { data: survivorsList } = await axios.get('/api/survivor');

      setSurvivors(survivorsList);
    };

    fetchSurvivors();
  }, []);

  return (
    <div>
      <Modal title="Create Survivor" isOpen={openModal} onClose={() => setOpenModal(false)} footerContent={<ModalFooter />}>
        <SurvivorModal survivor={targetSurvivor} onUpdateSurvivor={onUpdateSurvivor} />
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <div>
          <Title variant="h3" text="List of Survivors" />
          <p>You have {healthSurvivorsCount} healthy survivors</p>
        </div>

        <Button
          className="h-8 text-xs sm:text-md flex items-center bg-purple hover:bg-dark-purple dark:bg-gray-700 dark:hover:bg-gray-800"
          text="Add Survivor"
          onClick={() => setOpenModal(true)}
        />
      </div>

      <Table tableHeaders={survivorTableHeaders} tableItems={survivorTableItems} />
    </div>
  );
}
