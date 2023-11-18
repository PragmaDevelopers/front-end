"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    return (
        <main className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Admin</h1>
            </div>
            <div className="mt-4 flex flex-col items-center justify-between relative p-4">
                <h1>Content</h1>
            </div>
        </main>
    );
}

