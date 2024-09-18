import { Staff } from "@prisma/client";

export async function CreateContact(name:string){
    try {
        await fetch("https://sms.arkesel.com/api/v2/contacts/groups", {
          method: "POST",
          headers: {
            "api-key": process.env.ARKESEL!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ group_name: name }),
        });
  
       
      } catch (error) {}
  
}

export async function AddNumberToContact(staff:Staff){
    await fetch("https://sms.arkesel.com/api/v2/contacts", {
        method: "POST",
        headers: {
          "api-key": process.env.ARKESEL!,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_name: "Staff" + process.env.SCHOOL_ID!,
          contacts: [
            {
              phone_number: staff.phoneNumber,
              first_name: staff.firstName,
              last_name: staff.lastName,
              company: process.env.SCHOOL,
              email_address: staff.emailAddress,
              user_name: staff.id,
            },
          ],
        }),
      });
}