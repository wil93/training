"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DateTime, Menu } from "@olinfo/react-components";
import { Submission, getTaskSubmissions, isEvaluating } from "@olinfo/training-api";
import useSWR from "swr";

import { H2 } from "~/components/header";
import { Outcome } from "~/components/outcome";
import { useUser } from "~/components/user";
import { language } from "~/lib/language";

import { Skeleton } from "./skeleton";

type Props = {
  params: { name: string };
};

export default function Page({ params: { name: taskName } }: Props) {
  const user = useUser();

  const [refreshInterval, setRefreshInterval] = useState<number>();

  const { data: submissions } = useSWR<Submission[], Error, [string, string] | undefined>(
    user && ["api/submissions", taskName],
    ([, ...params]) => getTaskSubmissions(...params),
    { refreshInterval },
  );

  useEffect(() => {
    if (submissions?.some(isEvaluating)) {
      setRefreshInterval(1000);
    } else {
      setRefreshInterval(undefined);
    }
  }, [submissions]);

  if (!user) {
    return (
      <div>
        <H2 className="mb-2">Sottoposizioni</H2>
        <div className="text-center">
          <div className="my-2">Accedi per vedere le tue sottoposizioni</div>
          <Link
            href={`/login?redirect=${encodeURIComponent(`/task/${taskName}/submissions`)}`}
            className="btn btn-primary">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  if (!submissions) return <Skeleton />;

  return (
    <div>
      <H2 className="mb-2">Sottoposizioni</H2>
      <div className="w-full overflow-x-auto max-md:w-screen max-md:-translate-x-4 max-md:px-4">
        <Menu className="grid min-w-fit grid-cols-[auto_auto_1fr_auto]">
          <h3 className="menu-title col-span-4 grid grid-cols-subgrid gap-2">
            <div>ID</div>
            <div>Linguaggio</div>
            <div>Data e ora</div>
            <div className="text-end">Esito</div>
          </h3>
          {submissions.map((sub) => (
            <li key={sub.id} className="col-span-4 grid grid-cols-subgrid">
              <Link
                href={`/task/${taskName}/submissions/${sub.id}`}
                className="col-span-4 grid grid-cols-subgrid text-nowrap">
                <div className="w-20 font-mono">{sub.id}</div>
                <div>{language(sub.files[0].name)}</div>
                <div>
                  <DateTime date={sub.timestamp} />
                </div>
                <div className="min-w-40 text-end">
                  <Outcome submission={sub} />
                </div>
              </Link>
            </li>
          ))}
          {submissions.length === 0 && (
            <li className="col-span-full p-2 text-center">Nessuna sottoposizione inviata</li>
          )}
        </Menu>
      </div>
    </div>
  );
}
