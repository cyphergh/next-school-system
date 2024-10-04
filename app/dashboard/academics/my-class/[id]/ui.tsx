"use client";
import { AddTopic } from "@/actions/academics/subjects/new_topic";
import { GetTopics } from "@/actions/academics/subjects/topics";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Subject, Topic } from "@/types";
import { ToastAction } from "@radix-ui/react-toast";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlus, FaSync } from "react-icons/fa";
import { InfinitySpin } from "react-loader-spinner";

function UI({ subject, t }: { subject: Subject; t: Topic[] }) {
  "use client";
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [topics, setTopics] = useState(t);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const createTopic = async () => {
    if (!title)
      return toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    try {
      setLoading(true);
      const res = await AddTopic(title, subject.id);
      setLoading(false);
      if (res.error)
        return toast({
          title: "Error",
          description: res.errorMessage,
          variant: "destructive",
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });
      setShowNewTopic(false);
      setTitle("");
      setTopics(res.topics);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.toString(),
        variant: "destructive",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    }
  };
  const refresh = async () => {
    try {
      setRefreshing(true);
      const res = await GetTopics({ subjectId: subject.id });
      if (res.error)
        return toast({
          title: "Error",
          description: res.errorMessage,
          variant: "destructive",
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });
      setShowNewTopic(false);
      setTitle("");
      setTopics(res.topics);
      setRefreshing(false);
    } catch (error: any) {
      setRefreshing(false);
      toast({
        title: "Error",
        description: error.toString(),
        variant: "destructive",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    }
  };
  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-scroll sm:overflow-hidden p-2">
        <div className="text-center font-bold font-mono w-full p-4">
          {subject.class.className} {subject.name}
        </div>
        <Card className="p-2 flex gap-x-3 items-center">
          <FaSync
            onClick={refresh}
            size={30}
            className={`${refreshing && "animate-spin"} cursor-pointer`}
          ></FaSync>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for topic"
          ></Input>
          <Button onClick={() => setShowNewTopic(true)}>
            <FaPlus></FaPlus>
            Add
          </Button>
        </Card>
        {!topics.length && (
          <div className="flex flex-col flex-1 items-center justify-center font-bold text-2xl">
            No Topic Created
          </div>
        )}
        <div className="sm:flex sm:flex-row sm:flex-wrap sm:overflow-y-scroll sm:flex-1 content-start p-3 gap-2  ">
          {topics
            .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
            .map((t) => (
              <Card
                key={t.id}
                className="w-full sm:w-[48%] lg:w-[400px]  flex flex-col gap-2 p-4 mb-2  sm:mb-0 "
              >
                <div className="font-bold capitalize">{t.title}</div>
                <hr></hr>
                <div className="font-bold font-mono"> {t.term.name}</div>
                <hr></hr>
                <div className="flex flex-col gap-y-1">
                  <Link href={`./note/${t.id}`} className="cursor-pointer hover:border hover:border-blue-500 border p-2  rounded-md hover:ml-2">
                    <div className="flex flex-row justify-between p-2  items-center ">
                      <div>Notes</div>
                      <div className="flex gap-x-2 items-center">
                        <div>{t.notes.length}</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href={`./exercise/${t.id}`} className="cursor-pointer hover:border hover:border-blue-500 border p-2  rounded-md hover:ml-2">
                    <div className="flex flex-row justify-between p-2  items-center ">
                      <div>Exercise</div>
                      <div className="flex gap-x-2 items-center">
                        <div>{t.exercises.length}</div>
                      </div>
                    </div>
                  </Link>
                  <Link href={`./assignment/${t.id}`} className="cursor-pointer hover:border hover:border-blue-500 border p-2  rounded-md hover:ml-2">
                    <div className="flex flex-row justify-between p-2  items-center ">
                      <div>Assignment</div>
                      <div className="flex gap-x-2 items-center">
                        <div>{t.assignment.length}</div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* <div className="flex flex-row justify-between p-2 border">
                  <div>Project Works</div>
                  <div>{t.assignment.length}</div>
                </div> */}
                </div>
              </Card>
            ))}
        </div>
      </div>
      <AlertDialog open={showNewTopic} onOpenChange={setShowNewTopic}>
        <AlertDialogContent>
          {loading ? (
            <div className="w-full flex justify-center items-start">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : (
            <>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              ></Input>
              <AlertDialogFooter className="gap-2 flex">
                <Button onClick={createTopic}>Create</Button>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UI;
