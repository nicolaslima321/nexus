"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "~/components/common/Button";
import Card from "~/components/common/Card";
import { useNotification } from "~/contexts/NotificationContext";
import { useAuth } from "~/contexts/SurvivorContext";
import { ISurvivor } from "~/interfaces";
import { IAccount } from "~/interfaces/account";
import SignupFirstStep from "~/page-components/signup/FirstStep";
import SignupSecondStep from "~/page-components/signup/SecondStep";
import { isEmailValid } from "~/utils";
import axios from 'axios';

export default function SignupPage() {
  const router = useRouter();
  const { storeSurvivor } = useAuth();
  const { notify } = useNotification();

  const [step, setStep] = useState(1);

  const [survivor, setSurvivor] = useState<ISurvivor>({
    age: 0,
    fullName: '',
    gender: '',
    status: '',
    isInfected: false,
    latitude: 0,
    longitude: 0,
  });

  const [account, setAccount] = useState<IAccount>({
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const [isCreatingSurvivor, setIsCreatingSurvivor] = useState(false);

  const onUpdateSurvivorData = (key: string, value: string | number | boolean) => {
    if (step === 1) {
      setSurvivor({
        ...survivor,
        [key]: value,
      });
    } else if (step === 2) {
      setAccount({
        ...account,
        [key]: value,
      });
    }
  };

  const handleSignup = async () => {
    if (step === 1) {
      setStep(2);

      return;
    }

    setIsCreatingSurvivor(true);

    try {
      const survivorData = {
        ...survivor,
        ...account,
        name: survivor.fullName,
        infected: survivor.isInfected,
        lastLocation: {
          latitude: survivor.latitude,
          longitude: survivor.longitude,
        },
      };

      const { data } = await axios.post('/api/signup', survivorData);

      notify('success', 'You have successfully sign up!');

      storeSurvivor(data.survivor);

      router.push('/');
    } catch (err) {
      if (err.status === 422) {
        notify('error', 'E-mail already in use!');
      } else {
        notify('error', 'An error occurred while trying to create your account');
      }
    }

    setIsCreatingSurvivor(false);
  };

  const mustDisableButton = (targetObject: ISurvivor | IAccount) => {
    const hasPasswordWrong = account.password !== account.passwordConfirmation;
    const hasInvalidEmail = !isEmailValid(account.email);

    if (step === 2 && (hasPasswordWrong || hasInvalidEmail)) return true;

    return Object.entries(targetObject).some(([key, value]) => {
      if (key === 'isInfected') {
        return false;
      }

      return value == 0 || value === '';
    });
  }

  const liColorClass = (givenStep) => givenStep === step ? 'text-blue-600 dark:text-blue-500' : '';
  const spanColorClass = (givenStep) => givenStep === step ? 'border-blue-600 dark:border-blue-500' : 'border-gray-500 dark:border-gray-400';

  return (
    <div className="flex flex-col items-center">
      <ol className="flex justify-center items-center p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse w-10/12 sm:max-w-sm mb-6">
        <li className={`flex items-center ${liColorClass(1)}`}>
          <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${spanColorClass(1)}`}>
            1
          </span>
          Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
          <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
          </svg>
        </li>
        <li className={`flex items-center ${liColorClass(2)}`}>
          <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${spanColorClass(2)}`}>
            2
          </span>
          Finishing <span className="hidden sm:inline-flex sm:ms-2">up</span>
        </li>
      </ol>

      <Card className="w-10/12 sm:max-w-sm">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign-up on Nexus</h5>

            {step === 1 && <SignupFirstStep survivor={survivor} onUpdateSurvivor={onUpdateSurvivorData} />}

            {step === 2 && <SignupSecondStep account={account} onUpdateAccount={onUpdateSurvivorData} />}

            <hr className="dark:border-gray-700" />

            <Button
              className="w-full"
              disabled={mustDisableButton(step === 1 ? survivor : account)}
              text={step === 1 ? 'Next' : 'Sign Up'}
              isLoading={isCreatingSurvivor}
              onClick={handleSignup}
            />
          </div>
        </div>
      </Card>
    </div>
  )
};
