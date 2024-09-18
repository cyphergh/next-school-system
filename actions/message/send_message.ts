"use server";

import { SendMessageResponse } from "@/types";

export async function sendMessage(
  number: string,
  message: string
): Promise<SendMessageResponse> {
  try {
    console.log("Sending ",message, " to ",number);
    // await fetch(`https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARKESEL}&to=${number}&from=${process.env.SMS_ID}&sms=${message}`, {
    //     method: "GET",
    //   });
    return { error: false, message: "" };
  } catch (error:any) {
    throw Error(error.toString());
  }
}

