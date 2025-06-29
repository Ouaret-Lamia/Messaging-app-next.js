"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">You do not have any friend requests yet...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center justify-between bg-zinc-50 py-5 px-8 rounded-lg ring-1 ring-inset ring-gray-200">
            <div className="flex items-center gap-4">
              <UserPlus className="text-indigo-900" />
              <p className="font-medium text-lg">{request.senderEmail}</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => acceptFriend(request.senderId)}
                aria-label="Accept friend"
                className="px-3 py-1 bg-green-500 hover:bg-green-600 grid place-items-center rounded-sm transition hover:shadow-lg hover:cursor-pointer"
              >
                <Check className="font-semibold text-white" />
              </button>
              <button
                onClick={() => denyFriend(request.senderId)}
                aria-label="Deny friend"
                className="px-3 py-1 bg-red-500 hover:bg-red-600 grid place-items-center rounded-sm transition hover:shadow-lg hover:cursor-pointer"
              >
                <X className="font-semibold text-white" />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
