import {
  PruppyBubble,
  TypingBubble,
  UserBubble,
} from "@/components/ChatBubbles";
import type { ChatItem } from "@/lib/chatItems";

type Props = {
  items: ChatItem[];
  isTyping: boolean;
};

export function ChatThread({ items, isTyping }: Props) {
  return (
    <>
      {items.map((item) =>
        item.kind === "pruppy" ? (
          <PruppyBubble key={item.key}>{item.text}</PruppyBubble>
        ) : (
          <UserBubble key={item.key} answer={item.answer} />
        ),
      )}
      {isTyping && <TypingBubble />}
    </>
  );
}
