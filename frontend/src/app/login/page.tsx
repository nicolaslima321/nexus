"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "~/components/common/Button";
import Card from "~/components/common/Card";
import TextInput from "~/components/common/TextInput";

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(login);
    console.log(password);
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-10/12 sm:max-w-sm">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign-in on Nexus</h5>

            <TextInput
              id="login"
              name="login"
              placeholder="Enter your login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />

            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <hr className="dark:border-gray-700" />

            <Button
              className="w-full"
              text="Sign In"
              onClick={handleLogin}
              disabled={!login || !password}
            />

            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered? <Link href="/signup" className="text-blue-700 hover:underline dark:text-blue-500">Create account</Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
};
