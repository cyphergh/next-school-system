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
import React, { SetStateAction, useState } from "react";
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
import { AssType, Question, QuestionOptions } from "@/types";
import { Exercise, QuestionType } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { MdDelete } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import { CreateExercise } from "@/actions/academics/exercise/create";
import { InfinitySpin } from "react-loader-spinner";
function NewExercisePopup({subjectId,topicId,setExercises}:{subjectId:string,topicId:string,setExercises:React.Dispatch<SetStateAction<Exercise[]>>}) {
  const [exerciseType, setExerciseType] = useState<AssType>("OFFLINE");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [answerType, setAnswerType] = useState<QuestionType>("MULTIPLE_CHOICE");
  const [options, setOptions] = useState<QuestionOptions[]>([]);
  const [option, setOption] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");
  const [isAnswerTrue, setIsAnswerTrue] = useState<"true" | "false">("true");
  const [mark, setMark] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);
  const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const [loading, setLoading] = useState(false);
  const showError = (msg: string) => {
    toast({
      title: "Error",
      description: msg,
      variant: "destructive",
    });
    return;
  };
  const createExercise = async () => {
    if (exerciseType === "ONLINE" && !questions.length)
      return showError("Add a question or set it to offline");
    if (!title) return showError("Invalid title");
    if (!description) return showError("Invalid description");
    let totalMarks = 0;
    if (exerciseType === "OFFLINE") {
      if (isNaN(parseInt(mark))) return showError("Total marks invalid");
      totalMarks = parseFloat(mark);
    } else {
      totalMarks = questions.reduce((acc, i) => (acc += i.mark), 0);
    }
    if (totalMarks < 1) return showError("Total marks must be 1+");
    if (!dueDate && exerciseType === "ONLINE")
      return showError("Invalid Due Date");
    setLoading(true)
    const res = await CreateExercise({
      description,
      dueDate,
      questions,
      subjectId,
      title,
      topicId,
      total:totalMarks,
      type:exerciseType,
    });
    setLoading(false);
    if(res.error) return showError(res.errorMessage);
    setTitle("");
    setQuestions([]);
    setDescription("");
    setDueDate("");
    setMark("");
    setShow(false);
    if(res.exercises) setExercises(res.exercises);
    toast({
        title:"Exercise created",
        description:"Your new exercise has been added"
      })
  };

  const addQuestion = () => {
    if (!question)
      return toast({
        title: "Error",
        description: "Enter the question",
        variant: "destructive",
      });
    if (answerType == "MULTIPLE_CHOICE" && options.length < 2)
      return toast({
        title: "Error",
        description: "Multi choice question require 2+ options",
        variant: "destructive",
      });
    if (!mark || isNaN(parseInt(mark)))
      return toast({
        title: "Error",
        description: "Mark require",
        variant: "destructive",
      });
    questions.push({
      options: options,
      question: question,
      mark: parseInt(mark),
      type: answerType,
      isTrue: isAnswerTrue == "true" ? true : false,
    });
    setQuestion("");
    setAnswerType("MULTIPLE_CHOICE");
    setMark("");
    setOptions([]);
    setShowNewQuestion(false);
  };

  const addNewOption = () => {
    if (!option)
      return toast({
        title: "Error",
        description: "Enter the option",
        variant: "destructive",
      });
    if (options.find((e) => e.option == option))
      return toast({
        title: "Error",
        description: "Option exist",
        variant: "destructive",
      });
    options.push({
      option: option,
      isAnswer: isAnswer,
    });
    setIsAnswer(false);
    setOption("");
  };
  const deleteOption = (option: string) => {
    let filtered = options.filter((e) => e.option != option);
    setOptions(filtered);
  };

  return (
    <>
      <AlertDialog open={show} onOpenChange={setShow}>
        <AlertDialogTrigger>
          <Button className="rounded-full">
            <FaPlus></FaPlus>
          </Button>
        </AlertDialogTrigger>
        {
       loading? <AlertDialogContent className="flex flex-row items-center justify-center w-full">
        <InfinitySpin></InfinitySpin>
       </AlertDialogContent> :<AlertDialogContent className="min-h-full flex flex-col w-full max-h-full  overflow-y-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold flex flex-row items-center justify-center">
              Add New Exercise
            </AlertDialogTitle>
          </AlertDialogHeader>
          <hr />
          {exerciseType == "ONLINE" ? (
            <>
              <div className="flex flex-row items-center gap-x-2 justify-between">
                Questions
                <div className="flex gap-x-5">
                  <div className="font-bold text-center flex items-center justify-center">
                    {questions.length}
                  </div>{" "}
                  <Button
                    onClick={() => setShowNewQuestion(true)}
                    className="rounded-full"
                  >
                    <FaPlus></FaPlus>
                  </Button>
                </div>
              </div>
              <div className="flex flex-row items-center gap-x-2 justify-between">
                Total Marks
                <div className="flex gap-x-5">
                  <div className="text-center flex items-center justify-center text-2xl">
                    {questions.reduce((sum, a) => (sum += a.mark), 0)}
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowQuestionsPreview(true)}>
                Preview
              </Button>
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
            {exerciseType != "OFFLINE" ? (
              <></>
            ) : (
              <Input
                value={mark}
                onChange={(e) => setMark(e.target.value)}
                placeholder="Total Marks"
                type="number"
              />
            )}
            <hr />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              className="resize-none"
            ></Textarea>
            {exerciseType == "ONLINE" ? (
              <>
                <hr />
                <label className="font-mono">Due Date</label>
                <Input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  type="datetime-local"
                ></Input>
              </>
            ) : (
              <></>
            )}
          </div>
          <hr />
          <AlertDialogFooter>
            <Button onClick={()=>createExercise()}>Submit</Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
        }
      </AlertDialog>
      <AlertDialog open={showNewQuestion} onOpenChange={setShowNewQuestion}>
        <AlertDialogContent className="h-full flex flex-col overflow-y-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>New Question</AlertDialogTitle>
          </AlertDialogHeader>
          <hr></hr>
          <div className="flex-1 flex flex-col overflow-y-scroll gap-y-3">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="resize-none text-lg"
              placeholder="Question"
            ></Textarea>
            <Select
              value={answerType}
              defaultValue="MULTIPLE_CHOICE"
              onValueChange={(e) => setAnswerType(e as QuestionType)}
            >
              <SelectTrigger className="w-full p-4 text-lg ">
                <SelectValue placeholder="Answer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Answer Type</SelectLabel>
                  <SelectItem value={"MULTIPLE_CHOICE"}>
                    Multi Choice
                  </SelectItem>
                  {/* <SelectItem value="TRUE_FALSE">True/False</SelectItem> */}
                  {/* <SelectItem value="LONG_ANSWER">Text</SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              placeholder="Mark"
              type="number"
            />
            {answerType == "MULTIPLE_CHOICE" ? (
              <>
                <hr className="m-0"></hr>
                {options.map((e) => {
                  return (
                    <div
                      className={`p-2 flex items-center ${
                        e.isAnswer ? "text-green-700 font-bold" : ""
                      }`}
                      key={e.option}
                    >
                      <MdDelete
                        onClick={() => deleteOption(e.option)}
                        color="red"
                        className="cursor-pointer"
                        size={20}
                      ></MdDelete>{" "}
                      {e.option}
                    </div>
                  );
                })}
                <hr className="m-0"></hr>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-3">
                    {options.find((e) => e.isAnswer == true) ? (
                      <></>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <Label>Answer</Label>
                        <Checkbox
                          checked={isAnswer}
                          onCheckedChange={(e) => setIsAnswer(e as boolean)}
                        ></Checkbox>
                      </div>
                    )}
                    <Input
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                      placeholder="Option"
                    ></Input>
                  </div>
                  <Button
                    onClick={addNewOption}
                    className="flex mt-2 flex-row w-[140px] justify-between items-center gap-x-4"
                  >
                    Add Option <FaPlus></FaPlus>{" "}
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
            {answerType == "TRUE_FALSE" ? (
              <>
                <hr className="m-0"></hr>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-center gap-2">
                      <Label className="text-lg">Answer</Label>
                      <RadioGroup value={isAnswerTrue}>
                        <div className="flex flex-row gap-2 items-center">
                          <RadioGroupItem
                            className="h-6 w-6"
                            onClick={() => setIsAnswerTrue("true")}
                            value={"true"}
                          ></RadioGroupItem>
                          <Label>True</Label>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                          <RadioGroupItem
                            className="h-6 w-6"
                            onClick={() => setIsAnswerTrue("false")}
                            value={"false"}
                          >
                            False
                          </RadioGroupItem>
                          <Label>False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <AlertDialogFooter>
            <Button onClick={addQuestion}>Add</Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={showQuestionsPreview}
        onOpenChange={setShowQuestionsPreview}
      >
        <AlertDialogContent className="h-dvh flex flex-col overflow-hidden justify-start">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Questions Preview
            </AlertDialogTitle>
          </AlertDialogHeader>
          <hr />
          <div className="flex-1 flex flex-col overflow-y-scroll gap-2 p-4">
            {!questions.length ? (
              <div className="flex-1 flex-col flex text-center items-center justify-center font-bold text-xl">
                <div>No Question Added</div>
              </div>
            ) : (
              <></>
            )}
            {questions.map((e, i) => {
              return (
                <div
                  key={e.question}
                  className="flex flex-col gap-2 border p-3 rounded-sm"
                >
                  <div className="font-bold">
                    {i + 1}. {e.question}{" "}
                  </div>
                  {e.type == "TRUE_FALSE" && (
                    <div className="pl-4">
                      <div
                        className={`${e.isTrue && "text-green-500 italic"} `}
                      >
                        True
                      </div>
                      <div
                        className={`${!e.isTrue && "text-green-500 italic"}`}
                      >
                        False
                      </div>
                    </div>
                  )}

                  {e.type == "MULTIPLE_CHOICE" && (
                    <div className="pl-4">
                      {e.options.map((e, i) => {
                        return (
                          <div
                            className={`${
                              e.isAnswer && "text-green-700 italic"
                            }`}
                            key={e.option}
                          >
                            {alphabets[i]}. {e.option}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-between text-indigo-600">
                    [{e.mark} mark{e.mark > 1 && "s"}]{" "}
                    <FiDelete
                      size={25}
                      color="red"
                      className="cursor-pointer hover:pr-1"
                      onClick={() => {
                        let m = [...questions];
                        m.splice(i, 1);
                        setQuestions([...m]);
                      }}
                    ></FiDelete>{" "}
                  </div>
                </div>
              );
            })}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Seen</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default NewExercisePopup;
