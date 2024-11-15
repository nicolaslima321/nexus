"use client";

import { useState } from "react";
import Button from "~/components/common/Button";
import Card from "~/components/common/Card";
import SelectInput from "~/components/common/SelectInput";
import TextInput from "~/components/common/TextInput";

export default function LoginPage() {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isInfected, setIsInfected] = useState(false);

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

  const handleSignup = () => {
    console.log('signup');
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-10/12 sm:max-w-sm">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign-in on Nexus</h5>

            <TextInput
              id="fullName"
              name="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <TextInput
              id="password"
              name="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <SelectInput
              id="status"
              name="Health status"
              placeholder="Enter your health status"
              value={isInfected}
              options={statusOptions}
              onChange={(e) => setIsInfected(e.target.value === 'infected')}
            />

            <hr className="dark:border-gray-700" />

            <Button
              className="w-full"
              disabled={!fullName || !password}
              text="Sign Up"
              onClick={handleSignup}
            />
          </div>
        </div>
      </Card>
    </div>
  )
};
