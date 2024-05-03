"use client";

import React from "react";

import { useAccount } from "wagmi";

import PriviaAdmin from "./privia-admin";
import PriviaPlayer from "./privia-player";

interface Props {
  privote: Privote;
  results: any;
}

export default function Privote({ privote, results }: Props) {
  return <PriviaPlayer privia={privote} results={results} />;
}
