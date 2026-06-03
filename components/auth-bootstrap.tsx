"use client";

import { useEffect } from "react";
import { syncAuthFromServer } from "@/lib/dummy-auth";

export function AuthBootstrap() {
  useEffect(() => {
    void syncAuthFromServer();
  }, []);

  return null;
}

