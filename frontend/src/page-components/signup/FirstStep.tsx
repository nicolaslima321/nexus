"use client";

import SelectInput from "~/components/common/SelectInput";
import TextInput from "~/components/common/TextInput";
import { ISurvivor } from "~/interfaces";

interface ISignupFirstStep {
  survivor: ISurvivor;
  onUpdateSurvivor: (key: string, value: string | number | boolean) => void;
}

export default function SignupFirstStep({
  survivor,
  onUpdateSurvivor,
}: ISignupFirstStep) {
  const genderOptions = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

  const statusOptions = [
    {
      label: "I'm infected",
      value: "infected",
    },
    {
      label: "I'm healthy!",
      value: "healthy",
    },
  ];

  return (
    <>
      <TextInput
        id="name"
        name="Full Name"
        placeholder="Enter your full name"
        value={survivor.name}
        onChange={(e) => onUpdateSurvivor("name", e.target.value)}
      />

      <div className="sm:flex sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 w-full sm:w-[45%] sm:mb-0">
          <TextInput
            id="latitude"
            name="Latitude"
            placeholder="Current latitude"
            type="number"
            value={survivor.latitude}
            onChange={(e) => onUpdateSurvivor("latitude", e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[45%]">
          <TextInput
            id="longitude"
            name="Longitude"
            placeholder="Current longitude"
            type="number"
            value={survivor.longitude}
            onChange={(e) => onUpdateSurvivor("longitude", e.target.value)}
          />
        </div>
      </div>

      <SelectInput
        id="status"
        name="Health status"
        placeholder="Enter your health status"
        value={survivor.status}
        options={statusOptions}
        onChange={(e) => {
          onUpdateSurvivor("infected", e.target.value === "infected");
          onUpdateSurvivor("status", e.target.value);
        }}
      />

      <div className="sm:flex sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4  w-full sm:w-[45%] sm:mb-0">
          <TextInput
            id="age"
            name="Age"
            placeholder="Enter your age"
            type="number"
            value={survivor.age}
            onChange={(e) => onUpdateSurvivor("age", e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[45%]">
          <SelectInput
            id="gender"
            name="Gender"
            placeholder="Enter your gender"
            value={survivor.gender}
            options={genderOptions}
            onChange={(e) => onUpdateSurvivor("gender", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
