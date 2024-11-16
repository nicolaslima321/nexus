"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "~/components/common/Button";
import Card from "~/components/common/Card";
import TextInput from "~/components/common/TextInput";
import { useNotification } from "~/contexts/NotificationContext";

export default function LoginPage() {
  const { notify } = useNotification();

  const router = useRouter();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const authResult = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      if ([404, 401].includes(authResult.status)) {
        notify('error', 'Login or password is invalid');
      } else if (authResult.status === 200) {
        notify('success', 'You have successfully logged in');

        router.push('/');
      }
    } catch (err) {
      console.error('err');
      console.error(err);

      notify('error', 'An error occurred while trying to login');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-10/12 sm:max-w-sm">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign-in on Nexus</h5>

            <TextInput
              id="login"
              name="Login"
              placeholder="Enter your login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />

            <TextInput
              id="password"
              name="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <hr className="dark:border-gray-700" />

            <Button
              className="w-full"
              text="Sign In"
              isLoading={isLoading}
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
