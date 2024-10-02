"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

function UI() {
  'use client'
  const [showNewTopic, setShowNewTopic] = useState(false);
 
  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-scroll sm:overflow-hidden p-2">
        <Card className="p-2 flex gap-x-3">
          <Input placeholder="Search for topic"></Input>
          <Button onClick={() => setShowNewTopic(true)}>
            <FaPlus></FaPlus>
            Add
          </Button>
        </Card>
      </div>
      <AlertDialog open={showNewTopic} onOpenChange={setShowNewTopic}>
        <AlertDialogContent>
          <Input placeholder="Title" ></Input>
          <AlertDialogFooter className="gap-2 flex">
            <Button >Create</Button>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UI;
