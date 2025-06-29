"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import UnseenChatToast from "./UnseenChatToast";
import toast from "react-hot-toast";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => {
        const alreadyExists = prev.some((friend) => friend.id === newFriend.id);
        if (alreadyExists) return prev;
        return [...prev, newFriend];
      })
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      // Should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));

      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, sessionId, router]); 

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <div>
      {activeChats.length > 0 && (
        <div className="text-xs font-semibold leading-6 text-gray-400 mt-6">
          Your chats
        </div>
      )}
  
      <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
        {activeChats
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((friend) => {
            const unseenMessagesCount = unseenMessages.filter(
              (unseenMsg) => unseenMsg.senderId === friend.id
            ).length;
  
            return (
              <li key={friend.id}>
                <a
                  href={`/dashboard/chat/${chatHrefConstructor(
                    sessionId,
                    friend.id
                  )}`}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                >
                  {friend.name}
                  {unseenMessagesCount > 0 ? (
                    <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                      {unseenMessagesCount}
                    </div>
                  ) : null}
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
  
};

export default SidebarChatList;
