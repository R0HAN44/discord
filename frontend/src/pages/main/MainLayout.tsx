import CreateServerModal from "@/components/CreateServerModal";
import NavigationSideBar from "@/components/NavigationSideBar";
import { useModal } from "@/useAppStore";
import React, { useEffect } from "react";
import ServerLayout from "./ServerLayout";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { setDialogTriggerButton } = useModal();
  useEffect(() => {
    setDialogTriggerButton(false);
  }, []);

  return (
    <>
      <CreateServerModal />
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
