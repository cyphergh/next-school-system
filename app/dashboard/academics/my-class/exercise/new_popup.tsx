"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AssType, Question } from "@/types";
function NewExercisePopup() {
  const [exerciseType, setExerciseType] = useState<AssType>("OFFLINE");
  const [questions, setQuestions] = useState<Question[]>([]);
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button className="rounded-full">
            <FaPlus></FaPlus>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="min-h-full flex flex-col w-full max-h-full  overflow-y-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold flex flex-row items-center justify-center">
              Add New Exercise
            </AlertDialogTitle>
          </AlertDialogHeader>
          <hr />
          {exerciseType == "ONLINE" ? (
            <>
              <div className="flex flex-row items-center gap-x-2 justify-between">
                Questions <div className="flex gap-x-5"><div className="font-bold text-center flex items-center justify-center">{questions.length}</div> <Button className="rounded-full">
            <FaPlus></FaPlus>
          </Button></div>
              </div>
              <hr />
            </>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-4 flex-1 overflow-y-scroll">
            <label className="pl-1 font-mono" htmlFor="date">
              Exercise Type
            </label>
            <Select
              value={exerciseType}
              onValueChange={(e) => setExerciseType(e as AssType)}
            >
              <SelectTrigger className="w-full p-4">
                <SelectValue placeholder="Select Exercise Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Exercise Type</SelectLabel>
                  <SelectItem value={"OFFLINE"}>Offline</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {exerciseType == "ONLINE" ? (
              <></>
            ) : (
              <Input placeholder="Total Score" type="number" />
            )}
            <hr />
            <Textarea
              placeholder="Enter Description"
              className="resize-none"
            ></Textarea>
            {exerciseType == "ONLINE" ? (
              <>
                <hr />
                <label className="font-mono">Due Date</label>
                <Input type="datetime-local"></Input>
              </>
            ) : (
              <></>
            )}
          </div>
          <hr />
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {}}>Submit</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default NewExercisePopup;
