import loginImage from "@/assets/log-in.png";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";
import AppInfoButton from "@/components/(main)/layout/AppInfoButton";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center p-5">
        <div className="flex flex-row-reverse h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
            <div className="w-full space-y-10 overflow-y-auto p-10 pt-2 md:w-1/2">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-center text-3xl font-bold">Login to twixtter</h1>
                    <AppInfoButton />
                </div>                
                <div className="space-y-5">
                    <GoogleSignInButton />
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-muted" />
                        <span>OR</span>
                        <div className="h-px flex-1 bg-muted" />
                    </div>
                    <LoginForm />
                    <Link href="/signup" className="block text-center hover:underline">
                        Don&apos;t have an account? Sign up
                    </Link>
                </div>
            </div>
            <Image
                src={loginImage}
                alt=""
                className="hidden w-1/2 object-cover md:block"
            />
        </div>
        </main>
    );
}