import { Button } from "~/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { api } from "~/trpc/react";
import { useState } from "react";
import { cn } from "~/lib/utils";
export function CopyWishlist({ wishlistId }: { wishlistId: number }) {
    const wishlist = api.wishlist.getPrivateWishlist.useQuery({
        id: wishlistId,
    });

    const [confirm, setConfirm] = useState(false);

    const onCopy = () => {
        setConfirm(true);
        /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
        navigator.clipboard.writeText(`${window.location.href}/${wishlist.data?.id}`);
        setTimeout(() => {
            setConfirm(false);
        }, 900);
    }

    if (wishlist?.data?.public) return (
        <Button onClick={onCopy} variant={"ghost"} size={"sm"} className={cn("text-xs", confirm ? "bg-green-800 hover:bg-green-800 hover:text-white text-white" : '')} >
            <span className="flex items-center gap-2 justify-baseline">
                <span>{confirm ? "Copied" : "Copy link"}</span>
                <ClipboardCopy className="h-4 w-4" />
            </span>
        </Button>
    )
}