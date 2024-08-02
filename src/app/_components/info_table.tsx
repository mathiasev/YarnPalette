import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export function InfoTable({ info, onChange }: { info: Array<{ key: string; value: string }>; onChange: (info: Array<{ key: string; value: string }>) => void; }) {

    const [infoState, setInfoState] = useState(info);
    const [isKeyEditing, setIsKeyEditing] = useState(new Array(infoState.length).fill(false));
    const [isValueEditing, setIsValueEditing] = useState(new Array(infoState.length).fill(false));
    const [infoKey, setInfoKey] = useState("");
    const [infoValue, setInfoValue] = useState("");

    const handleUpdateKey = (index: number, key: string) => {
        setInfoState([...infoState.slice(0, index), { key, value: infoState[index].value }, ...infoState.slice(index + 1)]);
    }
    const handleUpdateValue = (index: number, value: string) => {
        setInfoState([...infoState.slice(0, index), { value, key: infoState[index].key }, ...infoState.slice(index + 1)]);
    }

    const handleSaveInfo = (index: number) => {
        setIsKeyEditing(isKeyEditing.map((isEditing: boolean, i: number) => i === index ? false : isEditing));
        onChange(infoState);
    }

    const handleRemoveInfo = (index: number) => () => {
        setInfoState(infoState.filter((_, i: number) => i !== index));
        onChange(infoState);
    }

    const handleAddInfo = () => {
        if (infoKey === "" || infoValue === "") return;
        setInfoState([...infoState, { key: infoKey, value: infoValue }]);
        onChange(infoState);
        setInfoKey("");
        setInfoValue("");
    }

    const handleEditKey = (index: number) => {
        setIsKeyEditing(isKeyEditing.map((isEditing: boolean, i: number) => i === index ? !isEditing : isEditing));
        if (isKeyEditing.at(index)) onChange(infoState);
    }
    const handleEditValue = (index: number) => {
        setIsValueEditing(isValueEditing.map((isEditing: boolean, i: number) => i === index ? !isEditing : isEditing));
        if (isValueEditing.at(index)) onChange(infoState);
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Info</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {infoState?.map((info: { key: string; value: string }, index: number) => (
                    <TableRow className="hover:bg-accent" key={`${index}-row`}>
                        <TableCell>
                            <Input className={cn(isKeyEditing.at(index) ? 'bg-red-600' : 'bg-card border-0')} type="text" readOnly={!isKeyEditing.at(index)} onDoubleClick={() => handleEditKey(index)} placeholder="Info" key={`${index}-key`} onKeyDown={(e) => e.key === "Enter" && handleSaveInfo(index)} value={info.key} onChange={(e) => handleUpdateKey(index, e.target.value)} />
                        </TableCell>
                        <TableCell>
                            <Input className={cn(isValueEditing.at(index) ? 'bg-red-600' : 'bg-card border-0')} type="text" readOnly={!isValueEditing.at(index)} onDoubleClick={() => handleEditValue(index)} placeholder="Info" key={`${index}-value`} onKeyDown={(e) => e.key === "Enter" && handleSaveInfo(index)} value={info.value} onChange={(e) => handleUpdateValue(index, e.target.value)} />
                        </TableCell>
                        <TableCell className="   ">
                            <Button variant={"destructive"} size={"icon"}
                                onClick={handleRemoveInfo(index)}>
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className=" ">
                        <Input type="text" placeholder="Info" value={infoKey} onChange={(e) => setInfoKey(e.target.value)} />
                    </TableCell>
                    <TableCell className="   ">
                        <Textarea placeholder="Details" value={infoValue} onChange={(e) => setInfoValue(e.target.value)} />
                    </TableCell>
                    <TableCell className="   ">

                        <Button variant={"default"} size={"icon"} onClick={handleAddInfo}>
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add</span>
                        </Button>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}