import Image from "next/image";
import { useState } from "react";
import { ImageColorPicker } from "react-image-color-picker";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function SkienImage({ skienId }: { skienId: number }) {
    const skien = api.skien.getByIdProtected.useQuery({ id: skienId });
    const utils = api.useUtils();
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [color, setColor] = useState("");

    const handleColorPick = (color: string) => {
        console.log('Selected color:', color); // Selected color: rgb(101, 42, 65)
        setColor(color);
        setIsPickingColor(false);
    };

    const saveColorMutation = api.skien.updateColor.useMutation({
        onSuccess: () => {
            /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
            utils.skien.invalidate();
        }
    });

    const saveColor = () => {
        if (!skien.data) return;
        saveColorMutation.mutate({
            id: skien.data.id,
            color
        });
        setIsPickingColor(false);
    }

    if (skien.isLoading) return <div>Loading...</div>

    return (
        <div className="relative">
            <Button onClick={() => setIsPickingColor(true)} className="absolute top-0 right-0">Pick color</Button>
            {color != "" && <Button onClick={saveColor} className="absolute top-0 right-0" style={{ backgroundColor: color ?? '#000000' }}>Save color</Button>}
            {
                (skien.data?.imageUrl && !isPickingColor) &&
                <Image src={skien.data?.imageUrl} alt={skien.data?.name} className="w-full aspect-[3/4] object-cover " width={400} height={400} />
            }
            {
                (isPickingColor && skien.data?.imageUrl) &&
                <div className="aspect-[3/4] w-full">
                    <ImageColorPicker
                        onColorPick={handleColorPick}
                        imgSrc={skien.data.imageUrl}
                        zoom={1}
                    />
                </div>
            }
        </div >
    )
}