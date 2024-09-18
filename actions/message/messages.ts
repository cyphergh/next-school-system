import { Staff } from "@prisma/client";

export const staffNewMessage =(staff:Staff) => `Welcome ${staff.firstName}, click on the link to continue your registration ${process.env.DOMAIN}/account/continue-staff/${staff.id}`