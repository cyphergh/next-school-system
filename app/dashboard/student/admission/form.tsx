import React, { forwardRef, Ref } from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { Card } from "@/components/ui/card";
const AdmissionFormPrinting = forwardRef(
  (props: {}, ref: Ref<HTMLDivElement>) => {
    return (
      <div ref={ref} className="w-[210mm]">
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-400 to-blue-900 pr-4 mb-8">
          <div className="flex items-center">
            <Card className="p-0 rounded-full bg-transparent border-0 mr-4">
              <Image src={Logo} alt="logo" className="w-[100px]"></Image>
            </Card>
            <div>
              <h1 className="text-white text-2xl font-bold">
                {process.env.NEXT_PUBLIC_SCHOOL}
              </h1>
              <h1 className="text-white text-lg font-bold">
                Ghana Education Service
              </h1>
              <p className="text-blue-100">{process.env.NEXT_PUBLIC_DOMAIN}</p>
              <p className="text-blue-100">
                {process.env.NEXT_PUBLIC_SCHOOL_SLOGAN}
              </p>
            </div>
          </div>
          <div className="text-right text-white">
            <p>{process.env.NEXT_PUBLIC_SCHOOL_LOCATION}</p>
            <p>{process.env.NEXT_PUBLIC_SCHOOL_CONTACT}</p>
            <p>{process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</p>
          </div>
        </div>
        <div className="p-2 w-full text-center pt-1 border-b-2 ">
          <h1 className="text-xl font-bold">
            Student Admission Form
          </h1>
        </div>
        <div className="w-full p-3 text-lg font-bold">
          <h1>Student Information</h1>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>First Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[60mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Last Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 w-[50%]">
            <div>Date Of Birth:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[15mm] text-muted-foreground text-slate-300 text-center">
              DD
            </div>
            <div className="border-r border-t border-b border-black h-[40px] w-[15mm] text-muted-foreground text-slate-300 text-center">
              MM
            </div>
            <div className="border-r border-t border-b border-black h-[40px] w-[30mm] text-muted-foreground text-slate-300 text-center">
              YYYY
            </div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Email:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2">
            <div>Gender:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[19mm] text-muted-foreground text-slate-600 text-center flex-row items-center justify-center p-2 ">
              Male
            </div>
            <div className="border-r border-t border-b border-black h-[40px] w-[19mm] text-muted-foreground text-slate-600 text-center flex-row items-center justify-center p-2 ">
              Female
            </div>{" "}
          </div>
          <div className="flex items-center gap-x-2 flex-1">
            <div>Address:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1 text-muted-foreground text-slate-600 text-center flex-row items-center justify-center p-2 "></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2">
            <div>Status:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[16mm] text-muted-foreground text-slate-600 text-center flex-row items-center justify-center p-2 ">
              Day
            </div>
            <div className="border-r border-t border-b border-black h-[40px] w-[22mm] text-muted-foreground text-slate-600 text-center flex-row items-center justify-center p-2 ">
              Boarding
            </div>{" "}
          </div>
          <div className="flex items-center gap-x-2 flex-1">
            <div>NHIS ID:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1 text-muted-foreground text-slate-600 text-center flex-row items-center justify-center p-2 "></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1">
            <div>Class:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1 text-muted-foreground text-slate-600 text-center flex-row items-center justify-center p-2 "></div>
          </div>
        </div>
        <div className="w-full p-2 border-b-2"></div>
        <div className="w-full p-3 text-lg font-bold">
          <h1>Guardian{"'"}s Information</h1>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>First Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[60mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Last Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>Phone Number:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[45mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Email:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="w-full p-2 border-b-2"></div>
        <div className="w-full p-3 text-lg font-bold">
          <h1>Mother{"'"}s Information</h1>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>First Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[60mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Last Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>Phone Number:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[45mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Email:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>Occupation:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[80mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1">
            <div>Date of birth:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="w-full p-2 border-b- mb-32"></div>
        <div className="w-full p-3 text-lg font-bold">
          <h1>Father{"'"}s Information</h1>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>First Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[60mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Last Name:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>Phone Number:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[45mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1 w-[50%]">
            <div>Email:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap p-4 w-full gap-x-2">
          <div className="flex items-center gap-x-2 ">
            <div>Occupation:</div>
            <div className="border-r border-t border-b border-black h-[40px] w-[80mm]"></div>
          </div>
          <div className="flex items-center gap-x-2 flex-1">
            <div>Date of birth:</div>
            <div className="border-r border-t border-b border-black h-[40px] flex-1"></div>
          </div>
        </div>
        <div className="w-full p-2 border-b-2 pb-8"></div>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Student Admission Privacy and Concern Agreement
          </h2>

          <form action="#" method="post">
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Privacy Policy</h3>
              <p className="mb-4">
                By enrolling your child at Golden Heart Academy, you acknowledge
                and agree to the following privacy policy:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-2">
                  The information collected will be used solely for the purposes
                  of student enrolment and administration.
                </li>
                <li className="mb-2">
                  Personal data will be securely stored and will not be shared
                  with third parties without your consent.
                </li>
                <li className="mb-2">
                  You have the right to access and update your child{"'"}s
                  information at any time.
                </li>
              </ul>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="privacy-policy"
                  name="privacy-policy"
                  className="mr-2"
                />
                <label className="text-sm">
                  I agree to the privacy policy.
                </label>
              </div>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment of Fees</h3>
              <p className="mb-4">
                Please review and agree to the payment terms below:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-2">
                  Admission fees must be paid in full before the start of the
                  term. No partial payments will be accepted for admission fees.
                </li>
                <li className="mb-2">
                  Partial payments are allowed for other fees, provided that
                  they are made according to the payment schedule agreed upon
                  with the school.
                </li>
                <li className="mb-2">
                  Refunds for admission fees are not allowed under any
                  circumstances.
                </li>

                <li className="mb-2">
                  The school reserves the right to update payment terms and
                  conditions as needed, with prior notice to parents or
                  guardians.
                </li>
              </ul>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="payment-terms"
                  name="payment-terms"
                  className="mr-2"
                />
                <label className="text-sm">I agree to the payment terms.</label>
              </div>
            </section>

            <section className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Parent/Guardian Signature:
                  </label>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    );
  }
);
AdmissionFormPrinting.displayName = "AdmissionFormPrinting";
export default AdmissionFormPrinting;
