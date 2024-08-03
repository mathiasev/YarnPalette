
import { wishlistItems } from "~/server/db/schema";
import { useState } from "react";

export function WishlistItems({ items }: { items: Array<typeof wishlistItems.$inferSelect> }) {

    const [itemState, setItemState] = useState(items);

    return (
        <div>

            {itemState?.map((item: typeof wishlistItems.$inferSelect, index: number) => (
                <div className="font-medium" key={`${index}-item`}>
                    {item.name}
                    <div className="hidden text-sm text-muted-foreground md:inline">
                        {item.description}
                    </div>
                </div>
            ))}
        </div>
    )
}