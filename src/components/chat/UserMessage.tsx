import type { Message } from "../../core/types"

interface UserMessageProps {
  message: Message
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="max-w-[90%] w-fit py-4 px-6 rounded-3xl bg-[var(--user-message-bg)] hover:bg-[var(--user-message-hover)] text-[var(--input-text)] break-words whitespace-pre-wrap transition-all duration-200 text-lg">
      {message.content}
    </div>
  )
}
