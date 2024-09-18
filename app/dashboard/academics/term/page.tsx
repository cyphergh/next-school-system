import React from "react";
import TopBar from "./component/topbar";
import { GetTerms } from "@/actions/academics/term/get-terms";
import { Term } from "@prisma/client";

async function TermPage() {
  let terms: Term[] = [];
  try {
    const res = await GetTerms();
    if (res.error) throw  Error(res.errorMessage);
    if (res.terms) terms = [...res.terms];
  } catch (error) {
    throw new Error("Connection Failed");
  }
  return <TopBar tms={terms}></TopBar>;
}

export default TermPage;
