"use client";

import { api } from "~/trpc/react";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";

export function Skiens() {
  const yourSkiens = api.skien.getLatest.useQuery();
  const placeholder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="relative mx-auto px-2 w-[90vw] xl:max-w-screen-lg xl:w-auto  grid grid-cols-1 xl:grid-cols-4 gap-12 ">
      {yourSkiens.isLoading && placeholder.map((_, i) => (
        <div key={i} className="grid gap-y-2 ">
          <Skeleton className="h-80 w-56 rounded" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="w-32 h-4" />
        </div>
      ))}
      {yourSkiens.data?.map((skien) => (
        <Link href={`/skiens/${skien.id}`} key={skien.id} className="grid gap-y-2 relative">
          <Badge className="absolute right-2 top-2" >{skien.skienStocks?.reduce((acc, curr) => acc + curr.stock, 0)}</Badge>
          {!skien.imageUrl && <Skeleton className="h-80 w-56 rounded bg-muted" />}
          {skien.imageUrl && <Image src={skien.imageUrl} alt={skien.name} width={224} height={320} className="h-80 w-56  rounded object-cover max-w-none" />}

          <h3 className="font-medium leading-none">{skien.name}</h3>
          <p className="text-xs text-muted-foreground">{skien.createdAt.toLocaleDateString('en-AU')} | {skien.organization ? 'Household' : 'Private'}</p>
        </Link>
      ))}

    </div>
  );
}
