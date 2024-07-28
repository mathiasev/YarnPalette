"use client"
import { useSearchParams } from "next/navigation";
;
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function SkienPage({ params }: { params: { skienId: string } }) {
    const skien = api.skien.getById.useQuery({ id: parseInt(params.skienId) });

    const s = useSearchParams();

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(skien.data?.name ?? "");

    useEffect(() => {
        setEditMode(s.get("edit") === "true");
    }, [s]);


    if (skien.isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>Skien Page</h1>
            <p>Skien ID: {params.skienId}</p>
            <p>Skien Name: {skien?.data?.name}</p>


            {editMode &&
                <Input type="text" defaultValue={skien.data?.name ?? ""} onChange={(e) => setName(e.target.value)} />
            }

        </div >
    )
}