import Image from "next/image";
import { ArrowUpRightFromCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src="/onlyFounder_logo.svg"
        height={100}
        width={100}
        alt="OnlyFounders Logo"
      />
      <h1 className="text-5xl mb-4 font-bold">OnlyFounders Admin Page</h1>
      <a className="bg-black text-lg hover:bg-gray-600 px-4 py-2 rounded-md text-white flex items-center gap-1.5" href="admin">Continue <ArrowUpRightFromCircle/> </a>
    </div>
  );
}
