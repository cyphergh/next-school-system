"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
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
import { Note, Topic } from "@/types";
import { Card } from '@/components/ui/card'
import { UpdateNote } from "@/actions/academics/class/note/update_note";

function UpdateNoteCard({
    e,
    setNotes,
}:{e:Note,  setNotes:React.Dispatch<React.SetStateAction<Note[]>>;
}) {
    const [content, setContent] = useState(e.content);
    const [showPreview, setShowPreview] = useState(false);
    const [title, setTitle] = useState(e.title);
    const [loading, setLoading] = useState(false);
    const [show,setShow] = useState(false);
    const { toast } = useToast();
    const update = async () => {
        if (!title) {
          setShowPreview(false);
          return toast({
            title: "Title cannot be empty",
            variant: "destructive",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
        }
        if (!content) {
          setShowPreview(false);
          return toast({
            title: "Note cannot be empty",
            variant: "destructive",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
        }
        try {
          setLoading(true);
          const res = await UpdateNote({
            title,
            content,
            topicId: e.topicId,
            subjectId:e.subjectId,
            noteId:e.id,
          }) 
          setLoading(false);
          if(res.error) return toast({
            title: res.errorMessage,
            variant: "destructive",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
          setTitle("");
          setContent("");
          setShow(false);
          setShowPreview(false);
          setNotes(res.notes);
        } catch (error) {
          
          setLoading(false);
          return toast({
            title: "Connection failed",
            variant: "destructive",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
        }
      };
  return (
    <>
      <Card onClick={() => setShow(true)} className="w-full sm:w-[48%] lg:w-[400px]  flex flex-col gap-2 p-4 mb-2  sm:mb-0 shadow-sm cursor-pointer">
                <div className='capitalize font bold'>
                    {e.title}
                </div>
            </Card>

            <AlertDialog open={show} onOpenChange={setShow}>
        <AlertDialogContent className="min-h-[90%] max-h-[90%] min-w-[90%] max-w-[90%] flex flex-col  overflow-hidden">
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : (
            <>
              <Input
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              ></Input>
              <div className="flex-1 lg:flex lg:flex-row flex-col overflow-hidden flex">
                <div className="flex-1 lg:flex-none  lg:w-1/2 border  p-2 lg:resize-x overflow-auto  flex flex-col">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="text-lg  resize-none outline-none border-none flex-1 bg-transparent 
          overflow-auto
          whitespace-pre
          border "
                    placeholder="Note"
                  ></textarea>
                </div>
                <div className="flex-1 border hidden lg:block overflow-y-scroll p-2 prose lg:prose-xl  dark:prose-invert">
                  <Markdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                  >
                    {content
                      ? content
                      : "### <center>  Note preview pane </center>"}
                  </Markdown>
                </div>
              </div>
              <AlertDialogFooter className="flex gap-2">
                <Button className="hidden lg:block" onClick={update}>
                  Update
                </Button>
                <Button
                  className="lg:hidden block"
                  onClick={() => setShowPreview(true)}
                >
                  Preview
                </Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent className="min-h-[90%] max-h-[90%] min-w-[90%] max-w-[90%] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-scroll p-2 prose lg:prose-xl  dark:prose-invert">
            <Markdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
            >
              {content ? content : "### <center>  Note preview pane </center>"}
            </Markdown>
          </div>
          {loading ? (
            <div className="w-full flex justify-center">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : (
            <>
              <AlertDialogFooter className="flex gap-2 flex-col">
                <Button className="lg:hidden block" onClick={update}>
                  Update
                </Button>
                <AlertDialogCancel>Ok</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UpdateNoteCard
