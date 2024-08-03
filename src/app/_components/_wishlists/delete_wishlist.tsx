import { Delete } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function DeleteWishlist({ wishlistId }: { wishlistId: number }) {

    const [confirm, setConfirm] = useState(false);

    const util = api.useUtils();
    const deleteWishlist = api.wishlist.deleteWishlist.useMutation({
        onSuccess: () => {
            /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
            util.wishlist.getWishlists.invalidate();
        }
    });

    const onDelete = () => {
        if (confirm) {
            deleteWishlist.mutate({
                id: wishlistId,
            });
        } else {
            setConfirm(true);
        }
    }



    return (
        <Button onClick={onDelete} variant={"ghost"} size={"sm"} className=" text-xs hover:bg-destructive hover:text-destructive-foreground">
            <span className="flex items-center gap-2 justify-baseline transition duration-100">
                <span>{confirm ? "Are you sure?" : "Delete list"}</span>
                <Delete className="h-4 w-4" />

            </span>
        </Button>
    )
}