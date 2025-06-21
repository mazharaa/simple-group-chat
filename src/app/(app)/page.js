"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useActionState } from "react";
import { loginAction } from "./action";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const [_, action, pending] = useActionState(loginAction, null);
  return (
    <main className="h-screen flex justify-center items-center">
      <Card className="w-96">
        <CardContent className="space-y-3">
          <h1 className="text-xl">Hey there, let’s join the community</h1>
          <form className="space-y-2" action={action}>
            <Input name="username" placeholder="What should we call you?" />
            <Button disabled={pending} type="submit" className="w-full">
              {pending ? (
                <>
                  <Loader2Icon className="animate-spin" /> Please wait
                </>
              ) : (
                "Start chat!"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
