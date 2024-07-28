"use client";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

import { api } from "~/trpc/react";
import { AddSkienDialog } from "./add_skien";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";

export function YourSkiens() {
  const yourSkiens = api.skien.getLatest.useQuery();


  return (
    <div>
      <div className="flex items-center justify-between gap-x-8">
        <div className="gap-y-1 gap-x-8">
          <h2 className="text-2xl font-semibold  text-foreground tracking-tight">
            Your skiens
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what you&apos;ve added recently.
          </p>
        </div>
        <div>
          <AddSkienDialog />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea className=" mx-auto px-2 max-w-screen-lg">
          <div className="flex gap-x-12 pb-4">
            {yourSkiens.isLoading && [...Array(10)].map((_, i) => (
              <div key={i} className="grid gap-y-2 ">
                <Skeleton className="h-80 w-56 rounded" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="w-32 h-4" />
              </div>
            ))}
            {yourSkiens.data?.map((skien) => (
              <Link href={`/skiens/${skien.id}`} key={skien.id} className="grid gap-y-2">
                {!skien.imageUrl && <Skeleton className="h-80 w-56 rounded bg-muted" />}
                {skien.imageUrl && <Image src={skien.imageUrl} alt={skien.name} width={100} height={100} className="rounded-full" />}

                <h3 className="font-medium leading-none">{skien.name}</h3>
                <p className="text-xs text-muted-foreground">{skien.createdAt.toLocaleDateString('en-AU')}</p>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
