"use client";

import { newStudentSchema } from "@/lib/class";
import { useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import StudentFormSelect from "@/components/form/select student";
import StudentFormInput from "@/components/form/input student";
import { ClassWithInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { LegacyRef, SetStateAction, useEffect, useRef, useState } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdCamera } from "react-icons/md";
import { CreateNewStudent } from "@/actions/student/admission";
import { Checkbox } from "@/components/ui/checkbox";
import { InfinitySpin } from "react-loader-spinner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import AdmissionFormPrinting from "./form";
import { useReactToPrint } from "react-to-print";

function AdmissionPictureUI({
  isNewAdmission,
  form,
  show,
  setShow,
}: {
  isNewAdmission: boolean;
  form: UseFormReturn<z.infer<typeof newStudentSchema>>;
  show: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [stream, setStreamer] = useState<MediaStream | null>(null);
  const [camera, setCamera] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [registering, setRegistering] = useState(false);
  const getUserM = async () => {
    try {
      const getUserMedia = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: camera,
          },
          width: 400,
          height: 400,
        },
        audio: false,
      });
      setStreamer(getUserMedia);
      if (!getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser.");
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (!videoRef.current) return;
      videoRef.current.autoplay = true;
      videoRef.current.muted = true;
      if (getUserMedia) {
        videoRef.current.srcObject = getUserMedia;
      }
    } catch (error) {
      throw new Error("getUserMedia is not supported in this browser.");
    }
  };
  useEffect(() => {
    if (imageData)
      if (stream)
        stream.getTracks().forEach((track) => {
          track.stop();
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  const switchCamera = async (id: string) => {
    if (!id) return;
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const userMediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 400,
        height: 400,
        deviceId: {
          exact: id,
        },
      },
      audio: false,
    });
    setCamera(id);
    setStreamer(userMediaStream);
  };
  const handleTakePicture = async () => {
    setLoading(true);
    setShow(false);
    setLoading(false);
  };
  const cancel = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsTakingPicture(false);
    setShow(false);
  };
  const takePicture = async () => {
    setImageData(null);
    setIsTakingPicture(true);
    try {
      let constraints: MediaStreamConstraints = {
        video: {
          width: 400,
          height: 400,
        },
        audio: false,
      };
      if (camera) {
        constraints = {
          video: {
            width: 400,
            height: 400,
            deviceId: {
              exact: camera,
            },
          },
          audio: false,
        };
      }
      const userMediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      setStreamer(userMediaStream);
      const videoDevices = (
        await navigator.mediaDevices.enumerateDevices()
      ).filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  const capture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    setImageData(dataURL);
  };
  useEffect(() => {
    takePicture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pickFromPc = () => {
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || !target.files || target.files.length < 1) return;
      const selectedFile = target.files[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
          const dataUrl = loadEvent.target?.result as string;
          setImageData(dataUrl);
        };

        reader.readAsDataURL(selectedFile);
      }
    });

    input.click();
  };
  const { toast } = useToast();
  const register = async () => {
    if (!imageData) return;
    try {
      const blob = dataURLtoBlob(imageData);
      const formData = new FormData();
      formData.append("image", blob, "image.png");
      formData.append("isNewAdmission", isNewAdmission.toString());
      setRegistering(true);
      const res = await CreateNewStudent(form.getValues(), formData);
      setRegistering(false);
      if (res.error)
        return toast({
          title: "!Oops",
          description: res.errorMessage,
          variant: "destructive",
          action: <ToastAction altText="ok-ok">Ok</ToastAction>,
        });
        cancel();
        form.setValue("address","");
        form.setValue("classId","");
        form.setValue("dateOfBirth","");
        form.setValue("emailAddress","");
        form.setValue("enrollmentDate","");
        form.setValue("lastName","");
        form.setValue("firstName","");
        form.setValue("type","DAY");
        form.setValue("gender","MALE");
        form.setValue("phoneNumber","");

      return toast({
        title: res.errorMessage,
        description: res.errorMessage,
        variant: "default",
        action: <ToastAction altText="ok">Ok</ToastAction>,
      });
    } catch (error) {
      setRegistering(false);
      toast({
        title: "!Oops",
        description: "Connection failed",
        variant: "destructive",
        action: <ToastAction altText="ok-ok">Ok</ToastAction>,
      });
    }
  };
  const dataURLtoBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");
    // if(!arr||!arr[0]||arr[0].match(/:(.*?);/)) return;
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  return (
    <>
      <div
        className={`${
          !registering && "hidden"
        } w-full flex flex-col justify-center items-center`}
      >
        <h1 className="text-2xl">Please wait ...</h1>
        <InfinitySpin color="blue" width="200"></InfinitySpin>
      </div>
      <div className={`${registering && "hidden"}`}>
        <div className="flex flex-col w-full">
          {!imageData && (
            <div className="w-full flex flex-row justify-between p-4 gap-x-2">
              <Button onClick={pickFromPc}>Choose from pc</Button>

              <Select onValueChange={switchCamera}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a camera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {devices.map((e) => {
                      return (
                        <SelectItem
                          key={e.deviceId}
                          value={e.deviceId}
                          className="capitalize"
                        >
                          {e.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="w-full flex flex-row justify-center">
            {!imageData && (
              <video
                ref={videoRef}
                autoPlay={true}
                className="bg-black dark:bg-white w-[300px] h-[300px] rounded-full max-w-full max-h-full"
              ></video>
            )}
            {imageData && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageData}
                className="w-[300px[ h-[300px] rounded-full max-w-full max-h-full"
                alt="image"
              ></img>
            )}
          </div>
          {!imageData && (
            <>
              <div className="p-6 flex w-full justify-center items-center">
                <MdCamera onClick={capture} size={45} />
              </div>
            </>
          )}
          {
            <div className="p-6 flex w-full justify-between">
              <Button onClick={cancel} className="text-red" variant={"outline"}>
                Cancel
              </Button>
              {imageData && <Button onClick={register}>Register</Button>}
            </div>
          }
        </div>
      </div>
    </>
  );
}
function AdmissionUI({ classesString }: { classesString: string }) {
  const [showTakePicture, setShowTakePicture] = useState(false);
  const classData: ClassWithInfo[] = JSON.parse(classesString);
  const [isNewAdmission, setIsNewAdmission] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof newStudentSchema>>({
    resolver: zodResolver(newStudentSchema),
    defaultValues: {
    },
  });
  const handleSubmit = async (value: z.infer<typeof newStudentSchema>) => {
    try {
      // Output: an array of videoDevices;
      
      setShowTakePicture(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return [];
    }
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  
  return (
    <>
    <div className="hidden">
    <AdmissionFormPrinting ref={printRef}></AdmissionFormPrinting>
    </div>
      <AlertDialog open={showTakePicture}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Student Profile Picture</AlertDialogTitle>
            <AlertDialogDescription>
              <AdmissionPictureUI
                isNewAdmission={isNewAdmission}
                form={form}
                show={showTakePicture}
                setShow={setShowTakePicture}
              ></AdmissionPictureUI>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex-1 overflow-y-scroll">
        <div className="w-full p-4 text-xl text-center gap-x-8 flex justify-center">
          Add Student Information <Button  onClick={handlePrint}>Print Admission Form</Button>
        </div>
        <Form {...form}>
          <form
            className="flex p-4 flex-col sm:flex-row sm:flex-wrap flex-1 gap-3 w-full h-full items-start content-start box-border"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="firstName"
                placeholder="Enter first name"
                form={form}
                label="First name"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="lastName"
                placeholder="Enter last name"
                form={form}
                label="Last name"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="dateOfBirth"
                placeholder="Enter Date of Birth"
                form={form}
                label="Date of Birth"
                type="date"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormSelect
                name="gender"
                placeholder="Gender"
                label="Choose gender"
                form={form}
                type=""
                data={[
                  { label: "MALE", value: "MALE" },
                  { label: "FEMALE", value: "FEMALE" },
                ]}
              ></StudentFormSelect>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="address"
                placeholder="Enter address"
                form={form}
                label="Address (Guardian)"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="phoneNumber"
                placeholder="Enter phone number"
                form={form}
                label="Phone number"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormSelect
                name="classId"
                placeholder="Select Class"
                label="Choose Class"
                form={form}
                type=""
                data={classData.map((c) => {
                  return {
                    label: c.className.toLocaleUpperCase(),
                    value: c.id,
                  };
                })}
              ></StudentFormSelect>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="emailAddress"
                placeholder="Enter email address"
                form={form}
                label="Email address"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormSelect
                name="type"
                placeholder="Student type"
                label="Choose student type"
                form={form}
                type=""
                data={[
                  { label: "DAY", value: "DAY" },
                  { label: "BOARDING", value: "BOARDING" },
                ]}
              ></StudentFormSelect>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="enrollmentDate"
                placeholder="Enrollment date"
                form={form}
                label="Admission Date"
                type="date"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="guardianName"
                placeholder="Guardian name"
                form={form}
                label="Guardian name"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="guardianPhone"
                placeholder="Guardian phone"
                form={form}
                label="Guardian phone number"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="guardianEmail"
                placeholder="Guardian email"
                form={form}
                label="Guardian email address"
                type="email"
              ></StudentFormInput>
            </div>

            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="mothersFirstName"
                placeholder="Mother's first name"
                form={form}
                label="Mother's first name"
                type="text"
              ></StudentFormInput>
            </div>

            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="mothersLastName"
                placeholder="Mother's last name"
                form={form}
                label="Mother's last name"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="mothersPhone"
                placeholder="Mother's phone number"
                form={form}
                label="Mother's phone number"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="mothersDateOfBirth"
                placeholder="Mother's date of birth"
                form={form}
                label="Mother's date of birth"
                type="date"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="mothersEmail"
                placeholder="Mother's email"
                form={form}
                label="Mother's email address"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="mothersAddress"
                placeholder="Mother's location"
                form={form}
                label="Mother's place of residence"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="mothersOccupation"
                placeholder="Mother's occupation"
                form={form}
                label="Mother's occupation"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="fathersFirstName"
                placeholder="father's first name"
                form={form}
                label="father's first name"
                type="text"
              ></StudentFormInput>
            </div>

            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="fathersLastName"
                placeholder="father's last name"
                form={form}
                label="father's last name"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="fathersPhone"
                placeholder="father's phone number"
                form={form}
                label="father's phone number"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="fathersDateOfBirth"
                placeholder="father's date of birth"
                form={form}
                label="father's date of birth"
                type="date"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="fathersEmail"
                placeholder="father's email"
                form={form}
                label="father's email address"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="fathersAddress"
                placeholder="Father's location"
                form={form}
                label="Father's place of residence"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full sm:w-[48%] lg:w-[230px] h-auto ">
              <StudentFormInput
                name="fathersOccupation"
                placeholder="Father's occupation"
                form={form}
                label="Father's occupation"
                type="text"
              ></StudentFormInput>
            </div>
            <div className="w-full flex gap-x-2 justify-center text-center pt-3">
              <Checkbox
                checked={isNewAdmission}
                onCheckedChange={(e) => setIsNewAdmission(e as boolean)}
                prefix="New Admission"
                className="w-[30px] h-[30px] rounded-full"
              ></Checkbox>
              <div>New Admission</div>
            </div>
            <div className="w-full flex justify-center items-center p-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export default AdmissionUI;
