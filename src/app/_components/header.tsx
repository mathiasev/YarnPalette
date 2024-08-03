"use client"

import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Palette } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base flex-shrink-0 text-primary"
                >
                    <Palette className="h-6 w-6" />
                    <span className="text-sm ">Yarn Palette</span>
                </Link>
                <Link
                    href="/"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Dashboard
                </Link>
                <Link
                    href="/skiens"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Skiens
                </Link>
                <Link
                    href="/wishlist"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Wishlist
                </Link>

            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Palette className="h-5 w-5 text-primary" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6  font-medium">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Palette className="h-6 w-6 text-primary" />
                            <span className="">Yarn Palette</span>
                        </Link>
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/skiens"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Skiens
                        </Link>
                        <Link
                            href="/wishlist"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Wishlist
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex   items-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <SignedIn>
                    <OrganizationSwitcher />
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    );
}