import {
  AccountType,
  Class,
  Expenditure,
  Father,
  Mother,
  Permissions,
  Prisma,
  Staff,
  Student,
  Term,
  User,
} from "@prisma/client";
import React from "react";
import { ZodBooleanDef } from "zod";

export interface LoginServerResponse {
  error: boolean;
  errorMessage?: string;
}

export interface StaffCheckResponse {
  error: boolean;
  exist: boolean;
}

export interface NavItem {
  link: string;
  hasSubMenu: boolean;
  title: string;
  image: React.ReactNode;
  permission: {
    title: Permissions;
    value: boolean;
  }[];
  subMenu?: NavItem[];
}

export interface NewStaffResponse {
  error: boolean;
  message: string;
}

export interface SendMessageResponse {
  error: boolean;
  message?: string;
}
export type TGetStaffBasicInfoWithUser = {
  error: boolean;
  staff?: Staff;
  errorMessage: string;
  banks?: { id: number; code: string; name: string }[];
};
export type TBankBranches = {
  id: number;
  branch_code: string;
  branch_name: string;
  swift_code: string;
  bic: string;
  bank_id: number;
};
export interface IGetBankBranches {
  error: boolean;
  errorMessage: string;
  branches?: TBankBranches[];
}
export type TConfirmAccount = {
  password: string;
  confirmPassword: string;
  bankName: string;
  bankAccount: string;
  network: string;
  momoNumber: string;
};

export type TSignInResponse = {
  error: boolean;
  errorMessage: string;
};
export type SessionData = {
  isLoggedIn: boolean;
  accountType?: AccountType;
  userId?: number;
};
export type TFIndAllStaff = {
  error: boolean;
  errorMessage: string;
  staffs?: StaffWithPermission[];
};
export type TFIndOneStaff = {
  error: boolean;
  errorMessage: string;
  staff?: StaffWithPermission;
};
export type TGetUser = {
  error: boolean;
  errorMessage: string;
  user?:
    | StaffWithPermission
    | StudentWithPermission
    | MotherWithPermission
    | FatherWithPermission;
};

type StaffWithPermission = Prisma.StaffGetPayload<{
  include: { permissions: true; user: true; images: true };
}>;
type MotherWithPermission = Prisma.MotherGetPayload<{
  include: { user: true; images: true; wards: true };
}>;
type FatherWithPermission = Prisma.FatherGetPayload<{
  include: { user: true; images: true; wards: true };
}>;
type StudentWithPermission = Prisma.StudentGetPayload<{
  include: { user: true; images: true };
}>;
type StaffInfo = Prisma.StaffGetPayload<{
  include: {
    permissions: true;
    user: true;
    images: true;
    activities: true;
    transactions: true;
  };
}>;
type ClassWithInfo = Prisma.ClassGetPayload<{
  include: {
    formMaster: {
      include: {
        images: true;
      };
    };
    classPrefect: {
      include: {
        images: true;
      };
    };
  };
}>;
type TGetStaffInformation = {
  error: boolean;
  errorMessage: string;
  staff?: StaffInfo;
};
type TGetTeachingStaffInformation = {
  error: boolean;
  errorMessage: string;
  staffs?: StaffWithPermission[];
  classes?: ClassWithInfo[];
};

type FullClassInfo = Prisma.ClassGetPayload<{
  include: {
    formMaster: {
      include: {
        images: {
          take: 1;
        };
      };
    };
    classPrefect: {
      include: {
        images: {
          take: 1;
        };
      };
    };
    students: {
      include: {
        images: {
          take: 1;
        };
      };
    };
    subjects: {
      include: {
        staff: {
          include: {
            images: {
              take: 1;
            };
          };
        };
      };
    };
  };
}>;
type StaffWithImageOnly = Prisma.StaffGetPayload<{
  include: { images: { take: 1 } };
}>;

type TGetClassFullInfo = {
  error: boolean;
  errorMessage: string;
  class?: FullClassInfo;
  teachers?: StaffWithImageOnly[];
};

type TClassList = {
  error: Boolean;
  errorMessage: string;
  classes?: Prisma.ClassGetPayload<{
    include: {
      students: {};
    };
  }>[];
};

type TGetEDBills = Prisma.EDBIllGetPayload<{
  include: {
    billItems: true;
    class: true;
    term: true;
  };
}>;

type TGetEDBillsResponse = {
  error: boolean;
  errorMessage: string;
  bills?: TGetEDBills[];
};

type TGetTerms = {
  error: boolean;
  errorMessage: string;
  terms?: Term[];
};

type EDBillItem = {
  name: string;
  amount: number;
  quantity: number;
};

type NewStudentResponse = {
  error: boolean;
  errorMessage: string;
  link?: string;
};

type StInfo = Prisma.StudentGetPayload<{
  include: {
    images: {
      take: 1;
    };
    mother: {
      include: {
        images: {
          take: 1;
        };
      };
    };
    father: {
      include: {
        images: {
          take: 1;
        };
      };
    };
    class: {
      include: {
        formMaster: {
          include: {
            images: {
              take: 1;
            };
          };
        };
      };
    };
    user: {
      select: {
        password: false;
        id:true,
        lastSeen:true,
      };
    };
  };
}>;
type StudentsInformation = {
  error: boolean;
  errorMessage: string;
  students?:StInfo[];
};

type CompleteTransactionType = Prisma.TransactionGetPayload<{
  include:{
    bill:{
      include:{
        items:true,
      }
    },
    Father:true,
    Mother:true,
    edBill:{
      include:{
        billItems:true
      }
    },
    staff:true,
    term:true,
    student:true,
  }
}>;

type GetStudentTransactionsResponse ={
  error:boolean;
  errorMessage:string;
  transactions?:CompleteTransactionType[];
  balance:number;
}

type PaymentResponse = {
  error:boolean;
  errorMessage:string;
  transactionId?:string;
  students?:StInfo[];
}

type PassBillResponse = {
  error:boolean;
  errorMessage:string;
}
type TNewExpense ={
  error:boolean;
  errorMessage:string;

}

type TTransactions = {
  error:boolean;
  errorMessage:string;
  transactions?:CompleteTransactionType[];
  expenses?:Expenditure[];
}

type Post={
  id:number;
  title:string;
  description:string;
  image?:string;
  likes:number;
  reviews:PostReview[]
}

type PostReview ={
  id:number;
  name:string;
  phone:string;
  message:string;
}