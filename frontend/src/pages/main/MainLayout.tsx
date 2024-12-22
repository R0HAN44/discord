import CreateServerModal from "@/components/CreateServerModal";
import NavigationSideBar from "@/components/NavigationSideBar";
import { useModal } from "@/useAppStore";
import React, { useEffect } from "react";
import ServerLayout from "./ServerLayout";
import InviteModal from "@/components/InviteModal";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { setDialogTriggerButton, onClose } = useModal();
  useEffect(() => {
    setDialogTriggerButton(false);
    onClose();
  }, []);

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <div className="h-full">
        <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
          <NavigationSideBar />
        </div>
        <main className="md:pl-[72px]" h-full>
          <ServerLayout>{children}</ServerLayout>
        </main>
      </div>
    </>
  );
};

export default MainLayout;
