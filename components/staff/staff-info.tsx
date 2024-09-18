"use client";
import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { getStaffInfo } from "@/actions/staff/getStaffInfo";
import { StaffInfo } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
function StaffInformation({ staffId }: { staffId: string }) {
    const [loadingInfo,setLoadingInfo] = useState(true);
    const [loadingLog,setLoadingLog] = useState(true);
    const [staff,setStaff] = useState<StaffInfo>();
    const {toast} = useToast();
    useEffect(()=>{
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const getData = async() =>{
      try {
        setLoadingInfo(true);
        setLoadingLog(true);
        const res = await getStaffInfo(staffId);
        setLoadingInfo(false);
        setLoadingLog(false);
        if(res.error) return toast({
          variant: "destructive",
          title: "Error",
          description: res.errorMessage,
          action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
        });
        if(!res.staff) return toast({
          variant: "destructive",
          title: "Error",
          description: "Error occurred",
          action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
        });
        setStaff(res.staff);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Connection failed",
          action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
        });
      }
    }
  return (
    <Tabs defaultValue="account" className="flex-1   h-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Information</TabsTrigger>
        <TabsTrigger value="logs">Activity Log</TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="flex flex-col items-center flex-1 overflow-scroll">
      {
        loadingInfo&&<InfinitySpin width="200" color="blue"></InfinitySpin>
      }
      {staff&&<>
        <div className="p-4 ">
        <Avatar className="w-[150px] h-[150px]">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${staff.images[0]?.id}`}
                  alt="profile"
                />
                <AvatarFallback>
                  {staff.firstName[0]}
                  {staff.lastName[0]}
                </AvatarFallback>
              </Avatar>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        {staff?.firstName} {staff?.lastName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Personal Information</h3>
          <p className="text-gray-600 dark:text-gray-400"><strong>Date of Birth:</strong> {staff?.dateOfBirth.toLocaleDateString() || 'N/A'}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Gender:</strong> {staff?.gender || 'N/A'}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Address:</strong> {staff?.address || 'N/A'}</p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Phone Number:</strong> 
            <a href={`tel:${staff?.phoneNumber}`} className="text-blue-600 dark:text-blue-400 no-underline">
              {staff?.phoneNumber || 'N/A'}
            </a>
          </p>          <p className="text-gray-600 dark:text-gray-400"><strong>Email:</strong> {staff?.emailAddress || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Employment Details</h3>
          <p className="text-gray-600 dark:text-gray-400"><strong>Date of Employment:</strong> {staff?.dateOfEmployment.toLocaleDateString() || 'N/A'}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Role:</strong> {staff?.role || 'N/A'}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Salary:</strong> {staff?.salary || 'N/A'}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>SSNIT Number:</strong> {staff?.ssnit || 'N/A'}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Bank Details</h3>
        <p className="text-gray-600 dark:text-gray-400"><strong>Bank Name:</strong> {staff?.bankName || 'N/A'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Bank Code:</strong> {staff?.bankCode || 'N/A'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Bank Branch:</strong> {staff?.bankBranch || 'N/A'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Account Number:</strong> {staff?.bankAccountNumber || 'N/A'}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Emergency Contact</h3>
        <p className="text-gray-600 dark:text-gray-400"><strong>Contact Name:</strong> {staff?.emergencyName || 'N/A'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Contact Number:</strong> {staff?.emergencyContact || 'N/A'}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Permissions</h3>
        <ul className="text-gray-600 dark:text-gray-400">
          {staff?.permissions?.length > 0 ? (
            staff.permissions.map(permission => (
              <li key={permission.id} className="flex justify-between">
                <span>{camelCaseToSpaces(permission.type)}</span>
                <span>{permission.value ? 'Granted' : 'Denied'}</span>
              </li>
            ))
          ) : (
            <li>No permissions assigned</li>
          )}
        </ul>
      </div>
    </div>
      </>}
      </TabsContent>
      <TabsContent value="logs" className="flex flex-col items-center flex-1 overflow-scroll ">
      {
        loadingInfo&&<InfinitySpin width="200" color="yellow"></InfinitySpin>
      }
      {
        staff&&<div className="p-4 w-full">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Activity Logs</h3>
        {staff.activities.length > 0 ? (
          <ul className="space-y-4">
            {staff.activities.map((activity) => (
              <li key={activity.id} className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Activity:</strong> {camelCaseToSpaces(activity.type)}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  <strong>Description:</strong> {activity.description || 'No description available'}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  <strong>Date:</strong> {new Date(activity.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No activity logs available.</p>
        )}
      </div>
      }
      </TabsContent>
    </Tabs>
  )
}

export default StaffInformation;


const camelCaseToSpaces = (str:string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, function(str){ return str.toUpperCase(); });
};