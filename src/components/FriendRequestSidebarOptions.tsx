"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface FriendRequestSidebarOptionsProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );

  useEffect(() => {
      pusherClient.subscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );

      pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
  
      const friendRequestHandler = () => {
        setUnseenRequestCount((prev) => prev + 1);
      };

      const addedFriendHandler = () => {
        setUnseenRequestCount((prev) => prev-1)
      }
  
      pusherClient.bind("incoming_friend_requests", friendRequestHandler);
      pusherClient.bind("new_friend", addedFriendHandler)
  
      return () => {
        pusherClient.unsubscribe(
          toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        );
        pusherClient.unsubscribe(
          toPusherKey(`user:${sessionId}:friends`)
        );
        pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
        pusherClient.unbind("new_friend", addedFriendHandler)
      };
    }, [sessionId])

  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className="text-indigo-500 border-indigo-300 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>

      {unseenRequestCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
            {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestSidebarOptions;
