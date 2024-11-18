"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface INotification {
  type: "success" | "warning" | "error" | "info";
  text: string;
}

interface NotificationContextType {
  showNotification: boolean;
  notification: INotification;
  setShowNotification: Dispatch<SetStateAction<boolean>>;
  notify: (type: string, text: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState<INotification>({
    type: "info",
    text: "",
  });

  const notify = (type: string, text: string) => {
    setNotification({
      type,
      text,
    });

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <NotificationContext.Provider
      value={{ notify, notification, showNotification, setShowNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return context;
}
