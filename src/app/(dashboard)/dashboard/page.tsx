import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friendsCount = (
    (await fetchRedis("smembers", `user:${session.user.id}:friends`)) as User[]
  ).length;

  const friends = await getFriendsByUserId(session.user.id);

  const messageCounts = await Promise.all(
    friends.map(async (friend) => {
      const messages = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        0,
        -1
      )) as string[];
  
      return messages.length;
    })
  );
  
  const messagesCount = messageCounts.reduce((acc, count) => acc + count, 0);
  

  const friendsWithLastMessage = (
    await Promise.all(
      friends.map(async (friend) => {
        const [lastMessageRaw] = (await fetchRedis(
          "zrange",
          `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
          -1,
          -1
        )) as string[];
  
        if (!lastMessageRaw) {
          return null;
        }
  
        const lastMessage = JSON.parse(lastMessageRaw) as Message;
  
        return {
          ...friend,
          lastMessage,
        };
      })
    )
  ).filter(Boolean);
  

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="grid grid-cols-2 w-full gap-4 md:grid-cols-4">
        <div className="col-span-2 rounded-lg shadow-sm p-6 flex items-center gap-4 hover:shadow-lg bg-white">
          <div className="relative h-15 w-15">
            <Image
              fill
              referrerPolicy="no-referrer"
              className="rounded-full "
              src={session.user.image || ""}
              alt="Your profile picture"
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold">{session.user.name}</h1>
            <p className="text-sm text-zinc-500">{session.user.email}</p>
          </div>
        </div>

        <div className="rounded-lg shadow-sm p-4 flex flex-col justify-center items-center bg-white hover:shadow-lg">
          <span className="text-3xl font-semibold">{friendsCount}</span>
          <span className="text-lg text-zinc-700 font-semibold">Friends</span>
        </div>

        <div className="rounded-lg shadow-sm p-4 flex flex-col justify-center items-center bg-white hover:shadow-lg">
          <span className="text-3xl font-semibold">{messagesCount}</span>
          <span className="text-lg text-center text-zinc-700 font-semibold">Total Messages</span>
        </div>
      </div>

      <div className="container p-6 rounded-lg shadow-sm bg-white">
        <h1 className="font-semibold text-2xl mb-8 text-zinc-500">Recent chats</h1>
        {friendsWithLastMessage.length === 0 ? (
          <p className="text-sm text-zinc-500">No chats yet...</p>
        ) : (
          friendsWithLastMessage.map((friend) => {
            if(!friend) return null

            return (
            <div
              key={friend.id}
              className="relative bg-zinc-50 border border-zinc-200 py-2 px-4 mb-3 rounded-md hover:bg-zinc-100 hover:border-zinc-300 transition-colors"
            >
              <div className="absolute right-4 inset-y-0 flex items-center">
                <ChevronRight className="h-7 w-7 text-zinc-400" />
              </div>

              <Link
                href={`/dashboard/chat/${chatHrefConstructor(
                  session.user.id,
                  friend.id
                )}`}
                className="relative sm:flex items-center"
              >
                <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                  <div className="relative h-6 w-6">
                    <Image
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      alt={`${friend.name} profile picture`}
                      src={friend.image}
                      fill
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold">{friend.name}</h4>
                  <p className="mt-1 max-w-md">
                    <span className="text-zinc-400">
                      {friend.lastMessage.senderId === session.user.id
                        ? "You: "
                        : ""}
                    </span>
                    {friend.lastMessage.text}
                  </p>
                </div>
              </Link>
            </div>
          )}
        ))}
      </div>
    </div>
  );
};

export default page;
