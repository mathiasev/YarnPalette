"use client";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

import { api } from "~/trpc/react";
import { AddSkienDialog } from "./add_skien";
import Image from "next/image";

export function YourSkiens() {
  const [yourSkiens] = api.skien.getLatest.useSuspenseQuery();


  return (
    <div>
      <div className="flex items-center justify-between gap-x-8">
        <div className="gap-y-1 gap-x-8">
          <h2 className="text-2xl font-semibold tracking-tight">
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
        <ScrollArea className=" mx-auto px-2">
          <div className="flex gap-x-12 pb-4">
            {yourSkiens.map((skien) => (
              <div className="space-y-1 text-sm" key={skien.id}>
                {!skien.imageUrl && <div className="h-80 w-44 rounded bg-gray-200"></div>}
                {skien.imageUrl && <Image src={skien.imageUrl} alt={skien.name} width={100} height={100} className="rounded-full" />}

                <h3 className="font-medium leading-none">{skien.name}</h3>
                <p className="text-xs text-muted-foreground">{skien.createdAt.toLocaleDateString('en-AU')}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
