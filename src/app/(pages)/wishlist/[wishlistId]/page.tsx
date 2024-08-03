"use client"
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "~/components/ui/context-menu";
import { type wishlistItems } from "~/server/db/schema";
import { api } from "~/trpc/react";

export default function WishlistPage({ params }: { params: { wishlistId: string } }) {
    const { wishlistId } = params;

    const wishlist = api.wishlist.getWishlist.useQuery({
        id: parseInt(wishlistId),
    });

    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold">
                    {wishlist.data?.name}
                </h1>

            </div>
            <div className="flex flex-col gap-4 mt-6">
                {wishlist.data?.wishlistItems?.map((item: typeof wishlistItems.$inferSelect) => (
                    <div key={item.id}>
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <p className="flex items-center gap-2 font-medium">
                                    {!item.link && <span>{item.name}</span>}
                                    {item.link && <Link href={item.link} target="_blank" className="hover:underline" rel="noreferrer">
                                        <span className="flex items-center gap-2 justify-baseline">
                                            <span>{item.name}</span>
                                            <span className="sr-only">Open link</span>
                                            <ExternalLink className="h-4 w-4 text-primary" />
                                        </span>
                                    </Link>}
                                </p>
                                <p className=" text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                {item.link && <ContextMenuItem className="w-full cursor-pointer flex justify-between items-center" onClick={() => window.open(item.link ?? undefined, "_blank")}>
                                    <span>Open link</span>
                                    <ExternalLink className="h-4 w-4 ml-2 text-primary" />
                                </ContextMenuItem>}
                            </ContextMenuContent>
                        </ContextMenu>
                    </div>
                ))}
            </div>
        </>
    )
}