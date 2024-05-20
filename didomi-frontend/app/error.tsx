"use client"; // Error components must be Client Components

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="w-screen h-screen bg-transparent flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>OOPS!</CardTitle>
          <CardDescription>Something Went Wrong</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset}>Try Again</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
