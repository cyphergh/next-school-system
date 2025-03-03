import {
  AccountType,
  Class,
  Exercise,
  Expenditure,
  Father,
  Mother,
  Permissions,
  Prisma,
  QuestionType,
  Staff,
  Student,
  Term,
  User,
} from "@prisma/client";
import { QueryOptions } from "@prisma/client/runtime/library";
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

export type AssType  =   "ONLINE"|"OFFLINE";

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
        id: true;
        lastSeen: true;
      };
    };
  };
}>;
type StudentsInformation = {
  error: boolean;
  errorMessage: string;
  students?: StInfo[];
};

type CompleteTransactionType = Prisma.TransactionGetPayload<{
  include: {
    bill: {
      include: {
        items: true;
      };
    };
    Father: true;
    Mother: true;
    edBill: {
      include: {
        billItems: true;
      };
    };
    staff: true;
    term: true;
    student: true;
    cancelationRequest: true;
  };
}>;

type GetStudentTransactionsResponse = {
  error: boolean;
  errorMessage: string;
  transactions?: CompleteTransactionType[];
  balance: number;
};

type PaymentResponse = {
  error: boolean;
  errorMessage: string;
  transactionId?: string;
  students?: StInfo[];
};

type PassBillResponse = {
  error: boolean;
  errorMessage: string;
};
type TNewExpense = {
  error: boolean;
  errorMessage: string;
};

type TTransactions = {
  error: boolean;
  errorMessage: string;
  transactions?: CompleteTransactionType[];
  expenses?: CompleteExpenditure[];
};
type CompleteExpenditure = Prisma.ExpenditureGetPayload<{
  include: {
    cancelationRequest: true;
  };
}>;
type Post = {
  id: number;
  title: string;
  description: string;
  image?: string;
  likes: number;
  reviews: PostReview[];
};

type PostReview = {
  id: number;
  name: string;
  phone: string;
  message: string;
};

type ExpenditureCancelationRequest = {
  expenses?: CompleteExpenditure[];
  error: boolean;
  errorMessage: string;
};

type TransactionCancelationRequest = {
  transactions?: CompleteTransactionType[];
  error: boolean;
  errorMessage: string;
};

type CompleteFinancialRequest = Prisma.FinancialCancelationRequestsGetPayload<{
  include: {
    expenditure: true;
    staff: true;
    transaction: true;
  };
}>;

type FinancialRequestResponse = {
  error: boolean;
  errorMessage: string;
  requests?: CompleteFinancialRequest[];
};

type Subject = Prisma.SubjectGetPayload<{ include: { class: true } }>;
type Topic = Prisma.TopicGetPayload<{
  include: {
    notes: true;
    term:true,
  };
}>;
type TTopicsResponse = {
  error: boolean;
  errorMessage: string;
  topics: Prisma.TopicGetPayload<{
    include:{
      exercises:true,
      assignment:true,
      term:true,
      notes:true,
      projectworks:true,
      subject:true,
    }
  }>[];
};
type Note = Prisma.NoteGetPayload<{
  include:{
    subject:true,
    staff:true,
    term:true,
    topic:true,
  }
}>
type TNewNote = {
  error:boolean;
  errorMessage:string;
  notes:Note[]
}

export type Question = {
  question:string,
  options: QuestionOptions[],
  type:QuestionType,
  isTrue?:boolean,
  mark:number,
}

export type QuestionOptions = {
  option:string;
  isAnswer:boolean;  
}

export enum CSSource { 
  System,
  Manual,
  Full  
}
type rT = Prisma.ReleaseExamsGetPayload<{
  include: {
    exams: {
      include: {
        records: {
          include: {
            subject: true;
          };
        };
      };
    };
    student: {
      include:{
        images:true;
    }
    };
    class: {
      include: {
        students: true;
        formMaster:true;
      };
    };
  };
}>;

type NewExerciseResponse  = {
  error:boolean;
  errorMessage:string;
  exercises?:Exercise[];
}
type NewAssignmentResponse  = {
  error:boolean;
  errorMessage:string;
  assignments?:Exercise[];
}

type StudentInfoData  = Prisma.StudentGetPayload<{
  include: {
    mother: true;
    father: true;
    class: {
      include: {
        formMaster: true;
      };
    };
    transactions: {
      take: 10;
      orderBy: {
        createdAt: "desc";
      };
    };
    images: {
      take: 1;
    };
    activities: {
      take: 10;

      orderBy: {
        createdAt: "desc";
      };
    };
    submissions: {
      include: {
        exercise: true;
        assessmentScore: {};
      };
      take: 10;
      orderBy: {
        createdAt: "desc";
      };
    };
  };
}>;

type CFADATA = {
  staffId: string;
  _sum: {
    amount: number|null; // Sum of amounts, can be null if no matching records
  };
  user: Staff|null
}[];

type CFAEXPENSES = {
  expenses: {
    staffId: string;
    _sum: {
      amount: number|null;
    };
  };
}