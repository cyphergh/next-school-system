"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaSync } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import NoStaffError from "./components/no-staff-error";
import { ClassWithInfo, StaffWithPermission } from "@/types";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { GetTeachingStaffWithNoClass } from "@/actions/staff/get-teaching-staff";
import NewClassDialog from "./components/new-class";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClassCard from "./components/class-card";

function ClassManagementPage({
  dataString,
  classesString,
}: {
  dataString: string;
  classesString: string;
}) {
  const staffData:StaffWithPermission[] = JSON.parse(dataString);
  const classData:ClassWithInfo[] = JSON.parse(classesString);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNoStaff, setShowNoStaff] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [staff, setStaff] = useState(staffData);
  const [stages, setStages] = useState(classData);
  const { toast } = useToast();
  const showAddNewClass = () => {
    if (staff.length < 1) return setShowNoStaff(true);
    setIsShown(true);
  };
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await GetTeachingStaffWithNoClass();
      setIsRefreshing(false);
      if (res.error) {
        return toast({
          variant: "destructive",
          title: "!Oops",
          description: res.errorMessage,
          action: <ToastAction altText={"error occurred"}>Ok</ToastAction>,
        });
      }
      setStaff([]);
      setStaff([...res.staffs!]);
      setStages([...res.classes!]);
    } catch (error) {
      setIsRefreshing(false);
      toast({
        variant: "destructive",
        title: "!Oops",
        description: "Error occurred",
        action: <ToastAction altText={"error occurred"}>Ok</ToastAction>,
      });
    }
  };
  return (
    <>
      <div className="p-2 flex-1 flex-col  w-full h-full overflow-y-scroll">
        <div className=" shadow-gray-300 dark:shadow-slate-500 shadow-md p-2 w-full flex flex-row gap-x-4 ">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full w-10 h-10 transition-colors duration-300
      bg-gray-200 text-gray-700 hover:bg-gray-300
      dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
      focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
          >
            <FaSync
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          <div className="flex items-center flex-1">
            <div className="relative w-full">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-4 py-2 pl-10 border rounded-lg shadow-sm outline-none focus:ring focus:ring-opacity-50 transition-colors
          bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                placeholder="Search..."
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
          <button
            onClick={showAddNewClass}
            className="flex items-center p-2 space-x-2 text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700
      dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaPlus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col sm:flex-row p-4 sm:flex-wrap content-start gap-4 overflow-y-scroll">
          {stages.map((e) => {
            return (
              <div
                key={"sc" + e.id}
                className="w-full sm:w-[48%] lg:w-[300px] "
              >
                <ClassCard e={e}></ClassCard>
              </div>
            );
          })}
        </div>
      </div>
      <NoStaffError
        error={showNoStaff}
        setError={setShowNoStaff}
      ></NoStaffError>
      <NewClassDialog
        setClasses={setStages}
        setStaffs={setStaff}
        setShown={setIsShown}
        staff={staff}
        shown={isShown}
      ></NewClassDialog>
    </>
  );
}

export default ClassManagementPage;
