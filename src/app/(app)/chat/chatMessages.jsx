"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronDown } from "lucide-react";
import moment from "moment";
import { useActionState, useEffect, useRef, useState } from "react";
import { deleteChatAction, editChatAction } from "./action";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import Avatar from "boring-avatars";

export function ChatMessages({ chats, username }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chats]);

  const formatDateLabel = (date) => {
    const now = moment();
    const chatDate = moment(date);

    if (now.isSame(chatDate, "day")) return "Today";
    if (now.subtract(1, "day").isSame(chatDate, "day")) return "Yesterday";
    return chatDate.format("MMMM D, YYYY");
  };

  let lastDateLabel = "";

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full" ref={scrollRef}>
        <div className="flex flex-col gap-2 pl-5 pr-10 pb-3">
          {chats.map((chat) => {
            const isFromCurrentUser = chat.username === username;
            const chatDateLabel = formatDateLabel(chat.createdAt);
            const showDateLabel = chatDateLabel !== lastDateLabel;
            lastDateLabel = chatDateLabel;
            return (
              <div key={chat._id}>
                {showDateLabel && (
                  <div className="text-center text-xs text-zinc-500 my-4">
                    {chatDateLabel}
                  </div>
                )}
                <div
                  className={`flex ${
                    isFromCurrentUser ? "justify-end" : "justify-start"
                  } space-x-2`}
                >
                  {!isFromCurrentUser && (
                    <Avatar
                      name={chat.username}
                      className="self-end"
                      variant="beam"
                      size={40}
                    ></Avatar>
                  )}
                  <div
                    className={`${
                      isFromCurrentUser
                        ? "bg-zinc-700 text-white rounded-br-none"
                        : "bg-white text-zinc-950 border-1 border-zinc-200 rounded-bl-none"
                    } py-1 px-3 rounded-md group max-w-150`}
                  >
                    <div className="flex w-full items-center">
                      {!isFromCurrentUser && (
                        <p className="text-sm text-rose-500">{chat.username}</p>
                      )}
                    </div>
                    <div className="flex">
                      <p className="text-base">{chat.message}</p>
                      {isFromCurrentUser && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <span className="ml-auto mr-0 w-3.5 group-hover:">
                              <ChevronDown className="scale-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" />
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <EditMenuItem chat={chat} />
                            <DeleteMenuItem id={chat._id} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 flex justify-end">
                      {moment(chat.createdAt).format("hh:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export function DeleteMenuItem({ id }) {
  return (
    <form action={deleteChatAction}>
      <input type="hidden" name="id" defaultValue={id} />
      <button type="submit" className="w-full text-left">
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </button>
    </form>
  );
}

export function EditMenuItem({ chat }) {
  const [_, action, pending] = useActionState(editChatAction, null);
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const isButtonDisabled =
    pending || textValue === chat.message || textValue.trim() === "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Edit
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild />
        </DialogFooter>
        <form className="flex items-stretch gap-4" action={action}>
          <Textarea
            className="!text-base flex-grow resize-none border rounded-md p-3 min-h-13 max-h-32 overflow-y-auto bg-white hide-scrollbar"
            rows={1}
            name="message"
            onChange={(e) => setTextValue(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isButtonDisabled) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
                setOpen(false);
              }
            }}
            defaultValue={chat.message}
          ></Textarea>
          <input type="hidden" name="id" defaultValue={chat._id} />
          <DialogClose asChild>
            <Button
              disabled={isButtonDisabled}
              className="h-auto w-12 rounded-full my-0.5 cursor-pointer"
              type="submit"
            >
              <Check className="scale-175" />
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
