"use client";

import Link from "next/link";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ThemeToggle from "./theme-toggle";
import { useRouter } from "next/navigation";
import { ConnectWalletButton } from "@/components/connect-wallet";
import CreatePrivoteForm from "./create-privote/create-privote-form";
import { useAccount } from "wagmi";

function NavBar() {
  const router = useRouter();

  const { address } = useAccount();

  return (
    <nav className="flex items-center justify-between py-4 max-w-screen-2xl mx-auto">
      <Link href="/" className="flex flex-col">
        <p className="text-4xl text-purple-400">🗳️ Privote</p>
      </Link>
      <div className="flex items-center gap-4 px-1 md:px-6">
        <div className="flex items-center space-x-2">
          <Switch
            onCheckedChange={(checked) =>
              checked ? router.push("?dev=true") : router.push("?dev=false")
            }
            id="dev-mode"
          />
          <Label htmlFor="dev-mode">Dev Mode</Label>
        </div>
        {address && <CreatePrivoteForm />}

        <ConnectWalletButton />
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default NavBar;
