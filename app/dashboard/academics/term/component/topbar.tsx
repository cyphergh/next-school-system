"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CreateTerm } from "@/actions/academics/term/new-term";
import { Term } from "@prisma/client";
import { Circles } from "react-loader-spinner";
import { ActiveTerm, DeActiveTerm } from "@/actions/academics/term/active-deactivate";
function TopBar({ tms }: { tms: Term[] }) {
  const [term, setTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [terms, setTerms] = useState<Term[]>(tms);
  const createTerms = async () => {
    setOpen(false);
    if (!term) {
      toast({
        title: "!Oops",
        description: "Give the new term a name",
        action: <ToastAction altText="Ok-dd">Ok</ToastAction>,
        variant: "destructive",
      });
      return;
    }
    setCreating(true);
    try {
      const res = await CreateTerm({ name: term });
      setTerm("");
      setCreating(false);
      if (res.errorMessage)
        return toast({
          title: "Error",
          description: res.errorMessage,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
          variant: "destructive",
        });
      if (res.terms) setTerms([...res.terms]);
    } catch (error) {
      setCreating(false);
      toast({
        title: "Connection failed",
        description: "Error connecting to server",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="w-full flex flex-col flex-1 overflow-hidden">
      <div className="w-full  flex flex-row justify-between items-center p-2">
        <Card className="w-full flex p-3 gap-x-3">
          <Input placeholder="Search..." className="p-4"></Input>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={creating}>
                <div className="mr-2">Create Term</div>{" "}
                {creating && <Circles width="20" color="white"></Circles>}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Term/Semester</DialogTitle>
                <DialogDescription>Create new Term/Semester</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center gap-4">
                  <Input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Term name (e.g First term)"
                    id="name"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createTerms}>-Create-</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
      <div className="flex-1 flex flex-col p-2 sm:flex-row sm:flex-wrap overflow-y-scroll gap-3 content-start">
        {terms.map((e: Term) => {
          return (
            <div key={e.id+""+(Math.random()*Math.random())} className="w-full sm:w-[48%] lg:w-[300px] ">
              <TermCard e={e} setTerms={setTerms}></TermCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TermCard({
  e,
  setTerms,
}: {
  e: Term;
  setTerms: React.Dispatch<React.SetStateAction<Term[]>>;
}) {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const updateTerm = async () => {
    try {
        setUpdating(true);
        let res;
        if(e.isActve){
             res = await DeActiveTerm(e.id);
        }else{
             res = await ActiveTerm(e.id);
        }
        setUpdating(false);
        if (res.errorMessage)
          return toast({
            title: "Error",
            description: res.errorMessage,
            action: <ToastAction altText="Ok">Ok</ToastAction>,
            variant: "destructive",
          });
        if (res.terms) setTerms([...res.terms]);
    } catch (error) {
    setUpdating(false);
      toast({
        title: "Connection failed",
        description: "Error connecting to server",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="w-full p-3 cursor-pointer text-lg">
      <div className="capitalize">{e.createdAt.getFullYear()}</div>
      <div className="capitalize">{e.name}</div>
      <div className="capitalize p-2">
        <Button className={`${e.isActve ? "bg-red-500" : ""}`} disabled={updating} onClick={updateTerm}>
          {e.isActve && "End term"}
          {!e.isActve && "Activate term"}
          {updating && <div className="ml-2">
         <Circles width="20" color="white"></Circles>
          </div>
         }
        </Button>
      </div>
    </Card>
  );
}

export default TopBar;
