"use client"
import { Delete, ExternalLink } from "lucide-react";
import Link from "next/link";
import { type wishlistItems } from "~/server/db/schema";
import { api } from "~/trpc/react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "~/components/ui/context-menu"


export function WishlistItems({ wishlistId }: { wishlistId: number }) {

    const utils = api.useUtils();

    const items = api.wishlist.getWishListItems.useQuery({
        wishlistId: wishlistId,
    });

    const deleteMutation = api.wishlist.deleteWishlistItem.useMutation(
        {
            onSuccess: () => {
                /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
                utils.wishlist.getWishListItems.invalidate({ wishlistId: wishlistId });
                /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
                utils.wishlist.getPrivateWishlist.invalidate({ id: wishlistId });
            }
        }
    );

    const handleDelete = (item: typeof wishlistItems.$inferSelect) => () => {
        deleteMutation.mutate({
            wishlistId: wishlistId,
            id: item.id,
        });
    }


    if (items.isLoading) return <div>Loading...</div>;
    if (items.data === null) return <div>No items</div>;
    return (
        <div className="flex flex-col gap-4 mt-6">
            {items.data?.map((item: typeof wishlistItems.$inferSelect) => (
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
                            <ContextMenuItem onClick={handleDelete(item)} className="w-full cursor-pointer flex justify-between items-center">
                                <span>Delete</span>
                                <Delete className="h-4 w-4 ml-2 text-destructive" />
                            </ContextMenuItem>

                        </ContextMenuContent>
                    </ContextMenu>
                </div>
            ))}
        </div>
    )
}