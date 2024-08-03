import { DeleteWishlist } from "./delete_wishlist";
import { CopyWishlist } from "./copy_wishlist";
import { WishlistItemForm } from "./wishlist_item_form";
import { EditWishlistForm } from "./edit_wishlist";

export function WishlistToolbar({ wishlistId }: { wishlistId: number }) {


    return (
        <div className="flex mb-2 mt-1 gap-1 lg:gap-2 text-xs flex-wrap lg:flex-nowrap">
            <WishlistItemForm wishlistId={wishlistId} />
            <CopyWishlist wishlistId={wishlistId} />
            <EditWishlistForm wishlistId={wishlistId} />
            <DeleteWishlist wishlistId={wishlistId} />
        </div>

    );
}