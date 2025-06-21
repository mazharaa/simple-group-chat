"use server";

import getUsername from "@/utils/getUsername";
import { revalidatePath } from "next/cache";

export default async function sentChatAction(_, formData) {
  const message = formData.get("message");
  const username = await getUsername();

  await fetch("https://v1.appbackend.io/v1/rows/gT3K2ntIxG7W", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ username, message }]),
  });

  revalidatePath("/chat");

  return {
    status: "success",
  };
}

export async function deleteChatAction(formData) {
  const chatId = formData.get("id");

  fetch("https://v1.appbackend.io/v1/rows/gT3K2ntIxG7W", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([chatId]),
  });

  revalidatePath("/chat");
}

export async function editChatAction(_, formdata) {
  const updatedMessage = formdata.get("message");
  const chatId = formdata.get("id");
  const username = await getUsername();

  await fetch("https://v1.appbackend.io/v1/rows/gT3K2ntIxG7W", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: chatId,
      username: username,
      message: updatedMessage,
    }),
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  revalidatePath("/chat");
}
