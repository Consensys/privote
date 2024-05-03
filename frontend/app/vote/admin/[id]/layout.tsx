"use client";

import { useSearchParams } from "next/navigation";

export default function Layout({
  app,
  dev,
}: {
  app: React.ReactNode;
  dev: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get("dev") === "true";

  return (
    <div className="flex flex-col">
      <div></div>
      {app}
      <div>{isDevMode && dev}</div>
    </div>
  );
}
