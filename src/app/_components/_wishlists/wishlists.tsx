"use client"
import { api } from "~/trpc/react";
import { AddWishlist } from "./add_wishlist";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { WishlistItems } from "./wishlist_items";
import { Badge } from "~/components/ui/badge";
import { WishlistToolbar } from "./wishlist_toolbar";
import { type wishlist as WishlistSchema } from "~/server/db/schema";

export function Wishlists() {

    const wishlistsQuery = api.wishlist.getWishlists.useQuery();

    if (wishlistsQuery.isLoading) return <div>Loading...</div>;


    function wishlistVisibility(wishlist: typeof WishlistSchema.$inferSelect): string {
        if (wishlist.public) return "Public";
        if (wishlist.organization !== undefined && wishlist.organization !== null) return "Household";
        return "Private";
    }



    return (
        <div className="w-full">
            <AddWishlist />
            <Accordion type="single" collapsible className="mt-4  w-full min-w-[400px]">
                {wishlistsQuery.data?.map((wishlist) => (
                    <AccordionItem key={wishlist.id} value={wishlist.id.toString()} >
                        <AccordionTrigger className="hover:no-underline group">
                            <div className="flex w-full items-center justify-between mr-4">
                                <p className="group-hover:underline text-lg font-medium">
                                    {wishlist.name}
                                </p>
                                <Badge variant="secondary" className="text-xs hover:no-underline">
                                    {wishlistVisibility(wishlist)}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <WishlistToolbar wishlistId={wishlist.id} />
                            <WishlistItems wishlistId={wishlist.id} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}