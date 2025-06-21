"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import sentChatAction from "./action";

export const Form = () => {
  const [state, action, pending] = useActionState(sentChatAction, null);
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    if (state?.status === "success") {
      setTextValue("");
    }
  }, [state]);

  const isDisabled = pending || textValue.trim() === "";
  return (
    <form className="flex items-stretch gap-4" action={action}>
      <Textarea
        className="!text-base flex-grow resize-none border rounded-md p-3 min-h-13 max-h-32 overflow-y-auto bg-white hide-scrollbar"
        placeholder="Type a message"
        rows={1}
        name="message"
        onChange={(e) => setTextValue(e.target.value)}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      ></Textarea>
      <Button
        disabled={isDisabled}
        className="h-auto my-0.5 cursor-pointer"
        variant="link"
      >
        <Send className="scale-150" />
      </Button>
    </form>
  );
};
