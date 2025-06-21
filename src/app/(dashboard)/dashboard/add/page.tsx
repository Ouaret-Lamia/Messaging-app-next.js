import AddFriendButton from "@/components/AddFriendButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const friends = await getFriendsByUserId(session.user.id);

  return (
    <main className="w-full">
      <div className="flex flex-col items-center justify-center w-full py-15 rounded-lg shadow-md">
        <h1 className="font-bold text-4xl mb-8 text-rose-900">Add a friend</h1>
        <AddFriendButton />
      </div>

      <div className="w-full p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500">
            You have no friends yet. Start by adding some!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md-grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <Link
                href={`/dashboard/chat/${chatHrefConstructor(
                  session.user.id,
                  friend.id
                )}`}
              >
                <div className="flex items-center gap-3 py-4 px-6 bg-zinc-50 ring-1 ring-inset ring-zinc-200 rounded-lg">
                  <div className="relative h-10 w-10">
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      src={friend.image || ""}
                      alt={`${friend.name}'s profile picture`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800">
                      {friend.name}
                    </h3>
                    <p className="text-sm text-zinc-500">{friend.email}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default page;
