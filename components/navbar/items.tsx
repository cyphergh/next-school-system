import { NavItem } from "@/types";
import React from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { PiChalkboardTeacherLight, PiContactlessPaymentLight, PiTestTube } from "react-icons/pi";
import { FaRegAddressCard } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { CiBank, CiMoneyBill } from "react-icons/ci";
import { SiMicrosoftacademic } from "react-icons/si";
import { IoListCircle, IoNotificationsOutline } from "react-icons/io5";
import { TbHistory, TbMessage2 } from "react-icons/tb";
import { IoPersonAddOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { CgEventbrite } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaBook } from "react-icons/fa6";

const navItems: NavItem[] = [
  {
    link: "/dashboard",
    hasSubMenu: false,
    title: "Dashboard",
    image: <MdOutlineDashboard size={30} />,
    permission: [
      {
        title: "Blocked",
        value: false,
      },
    ],
  },
  {
    link: "/dashboard/staff",
    hasSubMenu: true,
    title: "Staff",
    image: <PiChalkboardTeacherLight  size={30} />,
    permission: [
      {
        title: "Blocked",
        value: false,
      },
    ],
    subMenu: [
      {
        link: "/dashboard/staff/new-staff",
        hasSubMenu: false,
        title: "New Staff",
        image: <FaRegAddressCard size={30} />,
        permission: [
          {
            title: "AddStaffInfo",
            value: true,
          },
        ],
      },
      {
        link: "/dashboard/staff/staff-list",
        hasSubMenu: false,
        title: "Staff info",
        image: <MdGroups size={30} />,
        permission: [
          {
            title: "ViewStaffInfo",
            value: true,
          },
        ],
      },
    ],
  },
  {
    link: "/dashboard/student",
    hasSubMenu: true,
    title: "Student",
    image: <PiStudent size={30} />,
    permission: [
      {
        title: "Blocked",
        value: false,
      },
    ],
    subMenu: [
      {
        link: "/dashboard/student/admission",
        hasSubMenu: false,
        title: "Admission",
        image: <IoPersonAddOutline  size={30} />,
        permission: [
          {
            title: "AddStudentInfo",
            value: true,
          },
        ],
      },
      {
        link: "/dashboard/student/enrollment",
        hasSubMenu: false,
        title: "Enrollments",
        image: <IoListCircle  size={30} />,
        permission: [
          {
            title: "AddStudentInfo",
            value: true,
          },
        ],
      },
    ],
  },
  {
    link: "/dashboard/finance",
    hasSubMenu: true,
    title: "Finance",
    image: <CiBank size={30} />,
    permission: [
      {
        title: "DeleteBill",
        value: false,
      },
      
      {
        title: "EditBill",
        value: false,
      },
      {
        title: "MakePayment",
        value: false,
      },
      {
        title: "DeleteTransaction",
        value: false,
      },
      {
        title: "ViewTransaction",
        value: false,
      },
      
      {
        title: "CreateBill",
        value: false,
      },

    ],
    subMenu: [
      {
        link: "/dashboard/finance/my-transactions",
        hasSubMenu: false,
        title: "Transactions",
        image: <TbHistory size={30} />        ,
        permission: [
          {
            title: "Blocked",
            value:false
          }
        ],
      },
      {
        link: "/dashboard/finance/requests",
        hasSubMenu: false,
        title: "X Requests",
        image: <MdOutlinePendingActions size={30} />        ,
        permission: [
          {
            title: "SUPERADMIN",
            value:false
          }
        ],
      },
      {
        link: "/dashboard/finance/event-driven-bill",
        hasSubMenu: false,
        title: "ED Bill",
        image: <CgEventbrite size={30} />        ,
        permission: [
          {
            title: "CreateBill",
            value:true
          }
        ],
      },
     
      {
        link: "/dashboard/finance/payment",
        hasSubMenu: false,
        title: "Payment",
        image: <PiContactlessPaymentLight size={35} />        ,
        permission: [
          {
            title: "MakePayment",
            value:true
          }
        ],
      },
      {
        link: "/dashboard/finance/pass-bill",
        hasSubMenu: false,
        title: "Pass-Bill",
        image: <CiMoneyBill size={35} />        ,
        permission: [
          {
            title: "CreateBill",
            value:true
          }
        ],
      },
      {
        link: "/dashboard/finance/debtors",
        hasSubMenu: false,
        title: "Debtors",
        image: <HiUserGroup   size={30} />        ,
        permission: [
          {
            title: "ViewTransaction",
            value:true
          }
        ],
      },
      {
        link: "/dashboard/finance/expenditure",
        hasSubMenu: false,
        title: "Expenditure",
        image: <MdOutlineShoppingBag   size={35} />        ,
        permission: [
          {
            title: "MakePayment",
            value:true
          }
        ],
      },
  
    ],
  },
  {
    link: "/dashboard/academics",
    hasSubMenu: true,
    title: "Academics",
    image: <SiMicrosoftacademic size={30} />
    ,
    permission: [
      {
      title: "Blocked",
      value: false,
     }
  ],
    subMenu: [
      {
        link: "/dashboard/academics/class",
        hasSubMenu: false,
        title: "Class",
        image: <SiGoogleclassroom   size={30} />,
        permission: [
          {
            title: "ADMIN",
            value: true,
          },
        ],
      },
      {
        link: "/dashboard/academics/term",
        hasSubMenu: false,
        title: "Term",
        image: <SlCalender   size={30} />,
        permission: [
          {
            title: "SUPERADMIN",
            value: true,
          },
        ],
      },
      {
        link: "/dashboard/academics/my-class",
        hasSubMenu: false,
        title: "My Class",
        image: <FaBook size={25} />
        ,
        permission: [
          {
            title: "Blocked",
            value: false,
          },
        ],
      },
      {
        link: "/dashboard/academics/exams",
        hasSubMenu: false,
        title: "Exams",
        image: <PiTestTube size={25} />
        ,
        permission: [
          {
            title: "Blocked",
            value: false,
          },
        ],
      },
    ],
  },
  {
    link: "/dashboard/notification",
    hasSubMenu: true,
    title: "Alerts",
    image: <IoNotificationsOutline size={30} />,
    permission: [{
      title: "Blocked",
      value: false,
    }],
    subMenu: [],
  },
  {
    link: "/dashboard/message",
    hasSubMenu: true,
    title: "Message",
    image: <TbMessage2 size={30} />
    ,
    permission: [{
      title: "Blocked",
      value: false,
    }],
    subMenu: [],
  },
];

export default navItems;
