"use client";

import Button from "@/components/ui/Button";
import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";

const Page: FC = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function loginWithGoogle() {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch {
      toast.error("Something went wrong with your login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 via-white to-indigo-200 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10 space-y-8">
          <div className="flex flex-col items-center">
            <Icons.Logo width={150} height={150} />
            <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900">
              Welcome back 👋
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to connect with your friends
            </p>
          </div>

          <Button
            isloading={isLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-indigo-600 text-white font-medium py-3 hover:bg-indigo-700 transition"
            onClick={loginWithGoogle}
          >
            {!isLoading && (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
