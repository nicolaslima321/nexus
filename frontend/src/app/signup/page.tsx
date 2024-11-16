"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "~/components/common/Button";
import Card from "~/components/common/Card";
import SelectInput from "~/components/common/SelectInput";
import TextInput from "~/components/common/TextInput";
import { useNotification } from "~/contexts/NotificationContext";
import { ISurvivor } from "~/interfaces";

export default function LoginPage() {
  const router = useRouter();
  const { notify } = useNotification();

  const [survivor, setSurvivor] = useState<ISurvivor>({
    age: 0,
    fullName: '',
    gender: '',
    isInfected: false,
    latitude: 0,
    longitude: 0,
  });

  const [isCreatingSurvivor, setIsCreatingSurvivor] = useState(false);

  const updateSurvivor = (key: string, value: string | number | boolean) => {
    setSurvivor({
      ...survivor,
      [key]: value,
    });
  };

  const genderOptions = [
    {
      label: "Male",
      value: 'male',
    },
    {
      label: "Female",
      value: 'Female',
    },
    {
      label: "Other",
      value: 'other',
    }
  ];

  const statusOptions = [
    {
      label: "I'm infected",
      value: 'infected',
    },
    {
      label: "I'm healthy!",
      value: 'healthy',
    },
  ];

  const handleSignup = async () => {
    setIsCreatingSurvivor(true);

    try {
      const authResult = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(survivor),
      });

      if (authResult.status === 200) {
        notify('success', 'You have successfully sign up!');

        router.push('/');
      } else {
        notify('error', 'Failed to create account');
      }
    } catch (err) {
      console.error('err');
      console.error(err);

      notify('error', 'An error occurred while trying to create your account');
    }

    setIsCreatingSurvivor(false);
  };

  const hasFilledAllFields = () => {
    return Object.entries(survivor).some(([key, value]) => {
      if (key === 'isInfected') {
        return false;
      }

      return value == 0 || value === '';
    });
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-10/12 sm:max-w-sm">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign-up on Nexus</h5>

            <TextInput
              id="fullName"
              name="Full Name"
              placeholder="Enter your full name"
              value={survivor.fullName}
              onChange={(e) => updateSurvivor('fullName', e.target.value)}
            />

            <div className="sm:flex sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 w-full sm:w-[45%] sm:mb-0">
                <TextInput
                  id="latitude"
                  name="Latitude"
                  placeholder="Current latitude"
                  type="number"
                  value={survivor.latitude}
                  onChange={(e) => updateSurvivor('latitude', e.target.value)}
                />
              </div>

              <div className="w-full sm:w-[45%]">
                <TextInput
                  id="longitude"
                  name="Longitude"
                  placeholder="Current longitude"
                  type="number"
                  value={survivor.longitude}
                  onChange={(e) => updateSurvivor('longitude', e.target.value)}
                />
              </div>
            </div>

            <SelectInput
              id="status"
              name="Health status"
              placeholder="Enter your health status"
              value={survivor.isInfected}
              options={statusOptions}
              onChange={(e) => updateSurvivor('isInfected', e.target.value === 'infected')}
            />

            <div className="sm:flex sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4  w-full sm:w-[45%] sm:mb-0">
                <TextInput
                  id="age"
                  name="Age"
                  placeholder="Enter your age"
                  type="number"
                  value={survivor.age}
                  onChange={(e) => updateSurvivor('age', e.target.value)}
                />
              </div>

              <div className="w-full sm:w-[45%]">
                <SelectInput
                  id="gender"
                  name="Gender"
                  placeholder="Enter your gender"
                  value={survivor.gender}
                  options={genderOptions}
                  onChange={(e) => updateSurvivor('gender', e.target.value)}
                />
              </div>
            </div>

            <hr className="dark:border-gray-700" />

            <Button
              className="w-full"
              disabled={hasFilledAllFields()}
              text="Sign Up"
              isLoading={isCreatingSurvivor}
              onClick={handleSignup}
            />
          </div>
        </div>
      </Card>
    </div>
  )
};
