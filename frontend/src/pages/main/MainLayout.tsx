import CreateServerModal from "@/components/CreateServerModal";
import NavigationSideBar from "@/components/NavigationSideBar";
import { useModal } from "@/useAppStore";
import React, { useEffect } from "react";
import ServerLayout from "./ServerLayout";
import InviteModal from "@/components/InviteModal";
import EditServerModal from "@/components/EditServerModal";
import MembersModal from "@/components/MembersModal";
import CreateChannelModal from "@/components/CreateChannelModal";
import LeaveServerModal from "@/components/LeaveServerModal";
import DeleteServerModal from "@/components/DeleteServerModal";
import DeleteChannelModal from "@/components/DeleteChannelModal";
import EditChannelModal from "@/components/EditChannelModal";

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
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
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
