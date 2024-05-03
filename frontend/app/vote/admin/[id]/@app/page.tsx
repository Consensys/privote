import React, { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getPrivoteById,
  getVotesByPrivote,
  getResultsByPrivote,
} from "@/app/actions/privia";
import { notFound } from "next/navigation";
import { getPrivote, publishResults } from "@/app/actions/vote";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import PublishResults from "@/components/ui/publish-results";

interface Props {
  params: {
    id: string;
  };
}

export default async function PriviaAdmin({ params: { id } }: Props) {
  const privote = await getPrivote(id);

  if (!privote) {
    return notFound();
  }

  const encryptedVotes = await getVotesByPrivote(id);

  let results;

  if (privote.isClosed) {
    results = await getResultsByPrivote(id);
  }


  function truncateVoter(voter: string): string {
    return `${voter.slice(0, 5)}...${voter.slice(-5)}`;
  }

  return (
    <div className="grid grid-cols-2 p-6 pt-24 gap-8 w-full">
      <Card>
        <CardHeader>
          <div className="flex justify-between gap-2 mb-2">
            <CardTitle>{privote.title}</CardTitle>
            <Chip
              variant={privote.isClosed ? "danger" : "success"}
              className="animate-pulse"
            >
              {privote.isClosed ? "Closed" : "Open"}
            </Chip>
          </div>
          <CardDescription>
            {encryptedVotes.length} have already voted.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          {privote.isClosed && results.length > 0
            ? results
                .sort((a, b) => b.votes - a.votes)
                .map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 rounded-md border p-4"
                  >
                    <div className="flex-1 flex items-center justify-between space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {privote.choices[result.choice]}
                      </p>
                      <Chip variant={index === 0 ? "success" : "warning"}>
                        {result.votes} vote
                        {parseInt(result.votes) > 1 ? "s" : ""}
                      </Chip>
                    </div>
                  </div>
                ))
            : privote.choices.map((choice, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 rounded-md border p-4"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{choice}</p>
                  </div>
                </div>
              ))}
        </CardContent>
        <CardFooter>
          {!privote.isClosed ? <PublishResults id={id} /> : null}
        </CardFooter>
      </Card>
      <div>
        <h1 className="text-2xl font-bold">Encrypted votes</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Encrypted Vote</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {encryptedVotes.map((vote) => (
              <TableRow key={vote.voter}>
                <TableCell>{truncateVoter(vote.voter)}</TableCell>
                <TableCell className="font-medium">voted</TableCell>
                <TableCell>{vote.encryptedVote}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* <Button type="button" onClick={() => handleCalculateResults(privia.id)}>
        Calculate
      </Button> */}
    </div>
  );
}
