"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ shouldRefresh }: { shouldRefresh: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (shouldRefresh) {
      const interval = setInterval(() => {
        router.refresh();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [shouldRefresh, router]);

  return null;
}