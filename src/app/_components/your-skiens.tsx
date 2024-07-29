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
  const placeholder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      <div className="flex items-center justify-between gap-x-8 gap-y-4 flex-col xl:flex-row">
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
        <ScrollArea className=" mx-auto px-2 w-[90vw] xl:max-w-screen-lg xl:w-auto">
          <div className="flex gap-x-12 pb-4">
            {yourSkiens.isLoading && placeholder.map((_, i) => (
              <div key={i} className="grid gap-y-2 ">
                <Skeleton className="h-80 w-56 rounded" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="w-32 h-4" />
              </div>
            ))}
            {yourSkiens.data?.map((skien) => (
              <Link href={`/skiens/${skien.id}`} key={skien.id} className="grid gap-y-2">
                {!skien.imageUrl && <Skeleton className="h-80 w-56 rounded bg-muted" />}
                {skien.imageUrl && <Image src={skien.imageUrl} alt={skien.name} width={224} height={320} className="h-80 w-56 rounded object-cover max-w-none" />}

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
