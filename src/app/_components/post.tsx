"use client";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

import { api } from "~/trpc/react";

export function LatestPosts() {
  const [latestPosts] = api.post.getLatest.useSuspenseQuery();


  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Recent posts
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s been posted recently.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {latestPosts.map((post) => (
              <div className="space-y-1 text-sm" key={post.id}>
                <h3 className="font-medium leading-none">{post.name}</h3>
                <p className="text-xs text-muted-foreground">{post.createdAt.toLocaleDateString('en-AU')}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
