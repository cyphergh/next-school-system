"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Note } from "@prisma/client";
import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
  } from "@/components/ui/alert-dialog";
  import Markdown from "react-markdown";
  import remarkGfm from "remark-gfm";
  import remarkMath from "remark-math";
  import rehypeKatex from "rehype-katex";
  import rehypeRaw from "rehype-raw";
  import "katex/dist/katex.min.css";
  import { Button } from "@/components/ui/button";
  import { MdPreview } from "react-icons/md";
  import { useToast } from "@/components/ui/use-toast";
  import { ToastAction } from "@/components/ui/toast";
  import { InfinitySpin } from "react-loader-spinner";
  import { NewNote } from "@/actions/academics/class/note/new_note";
function UI({ notes }: { notes: Note[] }) {
  const [search, setSearch] = useState("");

  return (
    <>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      ></Input>
      <br></br>
      {!notes.length && (
        <div className=" flex flex-col flex-1 items-center justify-center font-bold text-2xl">
          No note added
        </div>
      )}

      {notes
        .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
        .map((e) => {
          return <NoteCard e={e}></NoteCard>;
        })}
    </>
  );
}

function NoteCard({ e }: { e: Note }) {
  const [show, setShow] = useState(false);

  return  <>
      <Card
        onClick={() => setShow(true)}
        className="w-full sm:w-[48%] lg:w-[400px]  flex flex-col gap-2 p-4 mb-2  sm:mb-0 shadow-sm cursor-pointer"
      >
        <div className="capitalize font bold">{e.title}</div>
      </Card>

      <AlertDialog open={show} onOpenChange={setShow}>
        <AlertDialogContent className="min-h-[100%] max-h-[100%] w-full max-w-[600px] flex flex-col  overflow-hidden">
        
              <div className="flex-1 lg:flex lg:flex-row flex-col overflow-hidden flex">
                <div className="flex-1  block overflow-y-scroll  prose lg:prose-xl  dark:prose-invert w-full">
                    <div className="font-bold capitalize w-full text-center underline">{e.title}</div>
                  <Markdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                  >
                    {e.content}
                  </Markdown>
                </div>
              </div>
              <AlertDialogFooter className="flex gap-2">
    
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </>
}
export default UI;
