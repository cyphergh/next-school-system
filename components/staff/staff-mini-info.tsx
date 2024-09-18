"use client";
import { Permissions, Staff } from "@prisma/client";
import React, { Suspense, useState } from "react";
import { Card } from "../ui/card";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { StaffWithPermission } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { CreateOrEditPermission } from "@/actions/staff/permission";
import { ToastAction } from "@radix-ui/react-toast";
import { useToast } from "../ui/use-toast";
import { ColorRing } from "react-loader-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import StaffInformation from "./staff-info";
TimeAgo.addDefaultLocale(en);
function StaffMiniInfo({
  staff,
  me,
}: {
  staff: StaffWithPermission;
  me: StaffWithPermission;
}) {
  const [teacher, setTeacher] = useState(staff);
  const timeAgo = new TimeAgo("en-US");
  const { toast } = useToast();
  const handlePermission = async (permission: Permissions) => {
    try {
      let res = await CreateOrEditPermission(permission, teacher.id);
      if (res.error)
        return  ({
          variant: "destructive",
          title: "Error",
          description: res.errorMessage!,
          action: <ToastAction altText={res.errorMessage!}>Ok</ToastAction>,
        });
      if (!res.staff)
        return toast({
          variant: "destructive",
          title: "Error",
          description: res.errorMessage!,
          action: <ToastAction altText={res.errorMessage!}>Ok</ToastAction>,
        });
      setTeacher(res.staff);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error occurred",
        action: <ToastAction altText={"oops"}>Ok</ToastAction>,
      });
    }
  };
  const [openInformationModal, setOpenInformationModal] = useState(false);
  return (
    <>
      {openInformationModal && (
        <Dialog defaultOpen={true} modal={true} open={true}>
          <DialogContent className="min-h-full flex flex-col w-full max-h-full  overflow-y-hidden p-2">
          <DialogHeader >
              <DialogTitle>Staff Information</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            
            <div className=" flex-1 w-full flex h-full flex-col overflow-y-scroll">
              <StaffInformation staffId={teacher.id}></StaffInformation>
            </div>
            <DialogFooter>
              <Button
                variant={"secondary"}
                onClick={() => setOpenInformationModal(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Card
        className={`p-4 w-full sm:w-[48%] lg:w-[300px] ${
          teacher.user?.password &&
          teacher.permissions.find((e) => e.type == "Blocked")?.value == false
            ? ""
            : "bg-red-100"
        }`}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="flex flex-row gap-4 items-center">
              <Avatar className="w-[60px] h-[60px]">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${teacher.images[0]?.id}`}
                  alt="profile"
                />
                <AvatarFallback>
                  {teacher.firstName[0]}
                  {teacher.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-ellipsis">
                  {teacher.firstName} {teacher.lastName}
                </div>
                <div className="text-muted-foreground text-sm">
                  {teacher.emailAddress}
                </div>
                <div className="text-muted-foreground text-sm">
                  {teacher.phoneNumber}
                </div>
                <div className="text-muted-foreground text-sm flex gap-x-4">
                  <div>active</div>
                  <div className="text-red-600">
                    {timeAgo.format(teacher.user!.lastSeen)}
                  </div>
                </div>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            {me.permissions.find((e) => e.type == "ViewStaffInfo")?.value && (
              <ContextMenuItem
                inset
                onClick={() => setOpenInformationModal(true)}
              >
                View Information
              </ContextMenuItem>
            )}
            {/* {
             me.permissions.find((e) => e.type == "EditStaffInfo")?.value && <ContextMenuItem inset>Edit Information</ContextMenuItem>
            } */}
            { me.permissions.find((e) => e.type == "SUPERADMIN")?.value &&
              <>
            <ContextMenuSeparator />
            <div className="w-full text-center font-bold">Permissions</div>
            <ContextMenuSeparator />

            <ContextMenuCheckboxItem
              onClick={() => handlePermission("Blocked")}
              checked={
                teacher.permissions.find((e) => e.type == "Blocked")?.value
              }
            >
              Blocked
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("Stopped")}
              checked={
                teacher.permissions.find((e) => e.type == "Stopped")?.value
              }
            >
              Stopped
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("AddStudentInfo")}
              checked={
                teacher.permissions.find((e) => e.type == "AddStudentInfo")
                  ?.value
              }
            >
              New Student
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("EditStudentInfo")}
              checked={
                teacher.permissions.find((e) => e.type == "EditStudentInfo")
                  ?.value
              }
            >
              Edit Student
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("AddStaffInfo")}
              checked={
                teacher.permissions.find((e) => e.type == "AddStaffInfo")?.value
              }
            >
              New Staff
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("ViewStaffInfo")}
              checked={
                teacher.permissions.find((e) => e.type == "ViewStaffInfo")
                ?.value
              }
              >
              View Staff Info
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("ConfirmTransaction")}
              checked={
                teacher.permissions.find((e) => e.type == "ConfirmTransaction")
                ?.value
              }
              >
              Confirm Transaction
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("CreateAlert")}
              checked={
                teacher.permissions.find((e) => e.type == "CreateAlert")?.value
              }
              >
              Create Alert
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("MakePayment")}
              checked={
                teacher.permissions.find((e) => e.type == "MakePayment")?.value
              }
              >
              Accept Payment
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("CreateBill")}
              checked={
                teacher.permissions.find((e) => e.type == "CreateBill")?.value
              }
            >
              Create Bill
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("SendMessage")}
              checked={
                teacher.permissions.find((e) => e.type == "SendMessage")?.value
              }
            >
              Send message
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("EditTransaction")}
              checked={
                teacher.permissions.find((e) => e.type == "EditTransaction")
                ?.value
              }
            >
              Edit Transaction
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("EditBill")}
              checked={
                teacher.permissions.find((e) => e.type == "EditBill")?.value
              }
            >
              Edit Bill
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("EditStaffInfo")}
              checked={
                teacher.permissions.find((e) => e.type == "EditStaffInfo")
                ?.value
              }
              >
              Edit Staff Info
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("ADMIN")}
              checked={
                teacher.permissions.find((e) => e.type == "ADMIN")?.value
              }
              >
              Admin
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              onClick={() => handlePermission("SUPERADMIN")}
              checked={
                teacher.permissions.find((e) => e.type == "SUPERADMIN")?.value
              }
              >
              Super Admin
            </ContextMenuCheckboxItem>
            </>}
          </ContextMenuContent>
        </ContextMenu>
      </Card>
    </>
  );
}

export default StaffMiniInfo;
