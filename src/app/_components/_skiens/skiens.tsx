"use client";

import { api } from "~/trpc/react";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Undo } from "lucide-react";
import { Button } from "~/components/ui/button";


export function Skiens() {
  const yourSkiens = api.skien.getLatest.useQuery();
  const placeholder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const [colorFilter, setColorFilter] = useState("");


  const filteredSkiens = yourSkiens.data?.filter((skien) => {
    if (colorFilter !== "" && skien.color !== colorFilter) return false;
    return true;
  });

  const colorsFromSkiens = yourSkiens.data?.reduce((acc, curr) => {
    if (curr.color) acc.push(curr.color);
    return acc;
  }, [] as string[]);

  return (
    <>

      <div className="flex gap-4 mt-1 mb-2 w-full justify-start">
        <div className="flex gap-1 items-center">
          <Select onValueChange={setColorFilter} value={colorFilter} >
            <SelectTrigger className="w-[180px] h-12" >
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              {colorsFromSkiens?.map((color) => (
                <SelectItem value={color} key={color}>
                  <div className="w-[100px] h-12" style={{ backgroundColor: color }}>
                    <span className="sr-only">{color}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setColorFilter("")} variant={"outline"} size={"icon"} className="">
            <Undo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative mx-auto px-2 w-[90vw] xl:max-w-screen-lg xl:w-auto  grid grid-cols-1 xl:grid-cols-4 gap-12 ">
        {yourSkiens.isLoading && placeholder.map((_, i) => (
          <div key={i} className="grid gap-y-2 ">
            <Skeleton className="h-80 w-56 rounded" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="w-32 h-4" />
          </div>
        ))}
        {filteredSkiens?.map((skien) => (
          <Link href={`/skiens/${skien.id}`} key={skien.id} className="grid gap-y-2 relative">

            <Badge className="absolute right-2 top-2" style={{ backgroundColor: skien.color ?? '#000000' }} >{skien.skienStocks?.reduce((acc, curr) => acc + curr.stock, 0)}</Badge>
            {!skien.imageUrl && <Skeleton className="h-80 w-56 rounded bg-muted" />}
            {skien.imageUrl && <Image src={skien.imageUrl} alt={skien.name} width={224} height={320} className="h-80 w-56  rounded object-cover max-w-none" />}

            <h3 className="font-medium leading-none">{skien.name}</h3>
            <p className="text-xs text-muted-foreground">{skien.createdAt.toLocaleDateString('en-AU')} | {skien.organization ? 'Household' : 'Private'}</p>
          </Link>
        ))}

      </div>
    </>
  );
}
