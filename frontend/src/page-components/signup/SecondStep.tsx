"use client";

import TextInput from "~/components/common/TextInput";
import { IAccount } from "~/interfaces/account";
import { isEmailValid } from "~/utils";

interface ISignupSecondStep {
  account: IAccount;
  onUpdateAccount: (key: string, value: string | number | boolean) => void;
}

export default function SignupSecondStep({
  account,
  onUpdateAccount,
}: ISignupSecondStep) {
  return (
    <>
      <TextInput
        id="email"
        name="E-mail"
        placeholder="Enter your e-mail"
        type="email"
        hasError={Boolean(account.email && !isEmailValid(account.email))}
        errorText="Must be a valid e-mail"
        value={account.email}
        onChange={(e) => onUpdateAccount("email", e.target.value)}
      />

      <TextInput
        id="password"
        name="Password"
        placeholder="Enter your password"
        type="password"
        value={account.password}
        hasError={Boolean(
          account.password !== account.passwordConfirmation &&
            account.passwordConfirmation,
        )}
        errorText="Passwords don't match"
        onChange={(e) => onUpdateAccount("password", e.target.value)}
      />

      <TextInput
        id="passwordConfirmation"
        name="Password Confirmation"
        placeholder="Confirm your password"
        type="password"
        value={account.passwordConfirmation}
        hasError={Boolean(
          account.password !== account.passwordConfirmation && account.password,
        )}
        errorText="Passwords don't match"
        onChange={(e) =>
          onUpdateAccount("passwordConfirmation", e.target.value)
        }
      />
    </>
  );
}
