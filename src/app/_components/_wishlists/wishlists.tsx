"use client"
import { api } from "~/trpc/react";
import { AddWishlist } from "./add_wishlist";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { WishlistForm } from "./wishlist_form";
import { WishlistItems } from "./wishlist_items";

export function Wishlists() {

    const wishlists = api.wishlist.getWishlists.useQuery();

    if (wishlists.isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Wishlists</h1>
            <AddWishlist />
            <Accordion type="single" collapsible className="mt-4  w-full min-w-[400px]">
                {wishlists.data?.map((wishlist) => (
                    <AccordionItem key={wishlist.id} value={wishlist.id.toString()}>
                        <AccordionTrigger>{wishlist.name}</AccordionTrigger>
                        <AccordionContent>
                            <WishlistForm wishlistId={wishlist.id} />
                            <WishlistItems items={wishlist.wishlistItems} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}