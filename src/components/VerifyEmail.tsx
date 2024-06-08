"use client";

import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { verifyEmailToken } from "@/actions/verifyEmailToken";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { useCallback, useEffect, useState } from "react";
interface VerifiedEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifiedEmailProps) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }
    if (!token) {
      setError("Token is missing");
      return;
    }

    verifyEmailToken(token)
      .then((res) => {
        setError(res.error);
        setSuccess(res.success);
        setIsLoading(false);
        toast.success("Email verified successfully");
        router.replace("/sign-in");
      })
      .catch(() => setError("An error occurred"));
  }, [token, success, error]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      onSubmit();
    }
  }, []);

  if (!success && error) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="h-8 w-8 text-red-600" />
        <h3 className="font-semibold text-xl">There was a problem</h3>
        <p className="text-muted-foreground text-sm">
          This token is not valid or might be expired. Please try again.
        </p>
      </div>
    );
  }

  if (success && !error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative mb-4 h-60 w-60 text-muted-foreground">
          <Image
            width={0}
            height={0}
            src="/hippo-email-sent.png"
            fill
            alt="the email was sent"
            className="w-auto h-auto max-w-full"
          />
        </div>

        <h3 className="font-semibold text-2xl">You&apos;re all set!</h3>
        <p className="text-muted-foreground text-center mt-1">
          Thank you for verifying your email.
        </p>
        <Link
          className={buttonVariants({ className: "mt-4 " })}
          href="/sign-in"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
      <h3 className="font-semibold text-xl">Verifying...</h3>
      <p className="text-muted-foreground text-sm">
        This won&apos;t take long.
      </p>
    </div>
  );
};

export default VerifyEmail;
