"use server";

import { getTaskList } from "@olinfo/training-api";
import { cookies } from "next/headers";
import { unstable_serialize } from "swr";
import PageClient from "./page-client";

export default async function Page({ params: { page: _page }, searchParams }) {
  const page = Number.parseInt(_page);
  const pageSize = 20;

  const token = cookies().get("training_token")?.value;
  const tasks = await getTaskList(page, pageSize, searchParams, `training_token=${token}`);

  const key = unstable_serialize(["api/tasks", page, pageSize, searchParams]);

  const fallback = {
    [key]: tasks,
  };

  return <PageClient fallback={fallback} />;
}
