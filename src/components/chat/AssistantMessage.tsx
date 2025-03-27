// import { Copy, Edit, Check } from "lucide-react";
import { useState } from "react"; 
import type { Message } from "../../core/types";

interface AssistantMessageProps {
  message: Message;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  // const [copied, setCopied] = useState(false); 

  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(message.content);
  //     setCopied(true); // Set copied state to true
  //     setTimeout(() => setCopied(false), 2000); 
  //     console.log("Content copied to clipboard");
  //   } catch (err) {
  //     console.error("Failed to copy content: ", err);
  //   }
  // };

  // const handleEdit = () => {
  //   console.log("Edit clicked");
  // };

  return (
    <div className="flex flex-col gap-2">
      <div className="py-4 px-6 rounded-lg bg-[var(--assistant-msg-bg)] hover:bg-[var(--assistant-msg-bg)]/90 max-w-[90%] w-fit break-words whitespace-pre-wrap transition-all duration-200 text-lg">
        {message.content}
      </div>
      {/* <div className="flex gap-3 ml-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
        </button> */}
        {/* <button
          onClick={handleEdit}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button> */}
    </div>
  );
}
