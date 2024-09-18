"use client";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form/input";
import FormSelect from "@/components/form/select";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import FullScreenLoading from "@/components/loading/fullscreen-loading";
import { LoginServerAction } from "@/actions/auth/login-action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AddNewStaff from "@/actions/staff/new staff";
import { newStaffSchema } from "@/lib/class";

function NewStaff() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof newStaffSchema>>({
    resolver: zodResolver(newStaffSchema),
    defaultValues: {
      
    },
  });
  const handleSubmit = async(value:z.infer<typeof newStaffSchema>) => {
    try {
      setLoading(true);
      let res = await AddNewStaff(value);
      setLoading(false);
      if(res.error){
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message,
          action: (
            <ToastAction altText={res.message}>Ok</ToastAction>
          ),
        });
        return;
      }
      form.reset();
      setShow(true);
    } catch (error:any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      });
    }
  };
  if(loading) return <FullScreenLoading></FullScreenLoading>
  return (
    <div className="flex-1  overflow-y-scroll mb-4">
      <AlertDialog open={show} defaultOpen={show} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Staff Added</AlertDialogTitle>
          <AlertDialogDescription>
          A text message has been sent to the registered staff to finalize the registration. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setShow(false)}>OK</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      <Form {...form}>
        <form
          className="flex p-2 flex-col sm:flex-row sm:flex-wrap flex-1 gap-3 w-full h-full items-start content-start box-border"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="firstName"
              placeholder="Enter first name"
              form={form}
              label="First name"
              type="text"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="lastName"
              placeholder="Enter last name"
              form={form}
              label="Last name"
              type="text"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="dateOfBirth"
              type="date"
              placeholder="Enter date of birth"
              form={form}
              label="Date of birth"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="phoneNumber"
              type="text"
              placeholder="Enter phone number"
              form={form}
              label="Phone number"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="emailAddress"
              type="text"
              placeholder="Enter email"
              form={form}
              label="Email"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="address"
              type="text"
              placeholder="Ghana post gps"
              form={form}
              label="Ghana post GPS"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormSelect
              name="gender"
              placeholder="Gender"
              label="Choose gender"
              form={form}
              type=""
              data={[
                { label: "MALE", value: "MALE" },
                { label: "FEMALE", value: "FEMALE" },
                { label: "OTHER", value: "OTHER" },
              ]}
            ></FormSelect>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="dateOfEmployment"
              type="date"
              placeholder="Date of employment"
              form={form}
              label="Date of employment"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="salary"
              type="number"
              placeholder="Agreed Salary"
              form={form}
              label="Salary"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="ssnit"
              type="text"
              placeholder="SSNIT"
              form={form}
              label="SSNIT ID"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="emergencyName"
              type="text"
              placeholder="Emergency contact name"
              form={form}
              label="Emergency contact name"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormInput
              name="emergencyContact"
              type="text"
              placeholder="Emergency contact number"
              form={form}
              label="Emergency contact number"
            ></FormInput>
          </div>
          <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
            <FormSelect
              name="role"
              placeholder="Role"
              label="Choose role"
              form={form}
              type=""
              data={[
                { label: "TEACHING", value: "TEACHING" },
                { label: "NON_TEACHING", value: "NON_TEACHING" },
                { label: "ADMIN", value: "ADMIN" },
              ]}
            ></FormSelect>
          </div>
            <div className="p-2 w-full flex justify-center items-center">
              <Button type="submit">Register Staff</Button>
            </div>
        </form>
      </Form>
    </div>
  );
}

export default NewStaff;
