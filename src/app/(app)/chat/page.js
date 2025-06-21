import Image from "next/image";
import getUsername from "@/utils/getUsername";
import { Form } from "./form";
import { ChatMessages } from "./chatMessages";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function Page() {
  const username = await getUsername();
  const res = await fetch(`https://v1.appbackend.io/v1/rows/gT3K2ntIxG7W`);
  const { data: chats } = await res.json();

  const reversedChats = [...chats].reverse();

  return (
    <main className="flex flex-col flex-1 h-full w-full max-w-5xl mx-auto rounded-md bg-stone-100">
      <header className="p-5 bg-gray-200 flex items-center space-x-3 rounded-t-md">
        <Link href="/">
          <Button variant="link" className="cursor-pointer">
            <ChevronLeft className="scale-150" />
          </Button>
        </Link>
        <Image src="/icon.svg" alt="logo" height={40} width={40} />
        <h1 className="text-lg font-medium">Devscale. Group Chat</h1>
      </header>
      <ChatMessages chats={reversedChats} username={username} />
      <div className="py-3 px-4 border-t bg-gray-200 rounded-b-md">
        <Form></Form>
      </div>
    </main>
  );
}
