"use client";
import { Staff } from "@prisma/client";
import UserImg from "@/public/user.svg";
import Image from "next/image";
import { FormEvent, FormEventHandler, useRef, useState } from "react";
import { dataURLtoBlob } from "@/lib/class";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import FullScreenLoading from "@/components/loading/fullscreen-loading";
import { FinishConfirmStaffAccount } from "@/actions/staff/get-basic-info";
import { TConfirmAccount } from "@/types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
function ContinueStaffRegistrationForm({
  params,
}: {
  params: { staff: Staff; banks: { id: number; code: string; name: string }[] };
}) {
  const [image, setImage] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router= useRouter();
  const { toast } = useToast();
  const addImage = () => {
    if (!imageRef.current) return;
    imageRef.current.click();
  };
  const handleImageChange = () => {
    if (!imageRef.current) return;
    if (!imageRef.current.files) return;
    if (!imageRef.current.files[0]) return;
    const imageReader = new FileReader();
    imageReader.onload = (e: ProgressEvent<FileReader>) => {
      const imageSrc = e.target?.result as string;
      setImage(imageSrc);
    };
    imageReader.readAsDataURL(imageRef.current.files[0]);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const formObject: { [key: string]: FormDataEntryValue } = {};

    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    if (!imageRef.current)
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Select passport picture",
        action: (
          <ToastAction altText={"Select passport picture"}>Ok</ToastAction>
        ),
      });
    if (!imageRef.current.files)
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Select passport picture",
        action: (
          <ToastAction altText={"Select passport picture"}>Ok</ToastAction>
        ),
      });
    if (!imageRef.current.files[0])
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Select passport picture",
        action: (
          <ToastAction altText={"Select passport picture"}>Ok</ToastAction>
        ),
      });
    if (formObject.password !== formObject.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password mismatch",
        action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
      });
      return;
    }
    if (formObject.password.toString().length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password is short",
        action: <ToastAction altText={"Password short"}>Ok</ToastAction>,
      });
      return;
    }
    setLoading(true);
    let conf = await FinishConfirmStaffAccount(formData, params.staff.id);
    setImage("");
    if (conf.error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: conf.errorMessage,
        action: <ToastAction altText={conf.errorMessage}>Ok</ToastAction>,
      });
      return;
    }
    router.replace("/sign-in");
  };
  if (loading) return <FullScreenLoading></FullScreenLoading>;
  return (
    <div className="flex flex-row w-full gap-4 flex-wrap p-4 items-start start content-start max-w-[400px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row w-full gap-4 flex-wrap p-4 items-start start content-start justify-center"
      >
        <div className="w-full flex flex-col items-center">
          <h1>Upload Passport Picture</h1>
          {!image ? (
            <Image
              onClick={addImage}
              src={UserImg}
              alt="user-avatar"
              className="w-[200px]"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              onClick={addImage}
              src={image}
              alt="user-image"
              className="w-[200px]  h-[200px] rounded-full"
            />
          )}
        </div>
        <Input
          name="profile"
          ref={imageRef}
          onChange={handleImageChange}
          className="hidden"
          type="file"
          accept="image/*"
          autoComplete="off"
        />
        <Input
          required
          name="password"
          type="password"
          placeholder="Choose Password"
        />
        <Input
          required
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
        />

        <h1>Bank Payment Method</h1>
        <select
          name="bank"
          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-300"
        >
          <option value="">Select Bank</option>
          {params.banks.map((e) => {
            return (
              <option key={e.id} value={e.name}>
                {e.name}
              </option>
            );
          })}
        </select>
        <Input
          name="bankAccount"
          autoComplete="off"
          type="text"
          placeholder="Bank Account Number"
          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-300"
        />
        <h1>Momo Payment Method</h1>
        <select
          name="network"
          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-300"
        >
          <option value={"MTN"}>MTN Mobile Money</option>
          <option value={"VODAFONE"}>Vodafone Cash</option>
          <option value={"AIRTELTIGO"}>AirtelTigo</option>
        </select>
        <Input
          type="tel"
          name="momoNumber"
          placeholder="Momo number"
          autoComplete="off"
          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-300"
          required
        />
        <Button>Finish</Button>
      </form>
    </div>
  );
}

export default ContinueStaffRegistrationForm;
