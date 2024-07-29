"use client"
import { Copy, MoreVertical } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Form } from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";



const stockFormSchema = z.object({
    skienId: z.number(),
    location: z.string().min(1),
    stock: z.number()
});

export default function SkienPage({ params }: { params: { skienId: string } }) {
    const skien = api.skien.getById.useQuery({ id: parseInt(params.skienId) });
    const skienInfo = skien.data?.info as Array<{ key: string; value: string }>;

    const addStock = api.skien.updateStock.useMutation(
        {
            onSuccess: () => {
                skien.data?.id && revalidatePath(`/skiens/${skien.data?.id}`)
            }
        }
    );

    const stockForm = useForm<z.infer<typeof stockFormSchema>>({
        resolver: zodResolver(stockFormSchema),
        defaultValues: {
            skienId: 0,
            location: "",
            stock: 0
        },
    })

    function stockFormOnSubmit(values: z.infer<typeof stockFormSchema>) {
        addStock.mutate(values);
    }



    if (skien.isLoading) {
        return <div>Loading...</div>
    }
    return (
        <main className="grid flex-1 items-start gap-4  md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    <Card
                        className="col-span-4" x-chunk="dashboard-05-chunk-0"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle>{skien?.data?.name}</CardTitle>
                            <CardDescription className="max-w-lg text-balance leading-relaxed">
                                {skien?.data?.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                        <CardTitle>Info</CardTitle>
                        <CardDescription>
                            Skien info
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Info</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {skienInfo?.map((info: { key: string; value: string }) => {
                                    return (<TableRow className="bg-accent" key={info.key}>
                                        <TableCell>{info.key}</TableCell>
                                        <TableCell>{info.value}</TableCell>
                                    </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card
                    className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
                >
                    {skien.data?.imageUrl && <Image src={skien.data?.imageUrl} alt={skien.data?.name} width={400} height={400} />}
                    <CardHeader className="flex flex-row items-start bg-muted/50">
                        <div className="grid gap-0.5">
                            <CardTitle className="group flex items-center gap-2 text-lg font-mono">
                                ID: {skien.data?.id}
                                <Button
                                    onClick={() => navigator.clipboard.writeText(skien.data?.id.toString() ?? "")}
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <Copy className="h-3 w-3" />
                                    <span className="sr-only">Copy ID</span>
                                </Button>
                            </CardTitle>

                        </div>
                        <div className="ml-auto flex items-center gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="outline" className="h-8 w-8">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                        <span className="sr-only">More</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Export</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Trash</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                        <div className="grid gap-3">
                            <div className="font-semibold">Stock</div>
                            <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Location
                                    </span>
                                    <span>qty</span>
                                </li>
                            </ul>
                            <Separator className="my-2" />
                            <ul className="grid gap-3">
                                <li className="flex items-center justify-between font-semibold">
                                    <span className="text-muted-foreground">Total</span>
                                    <span>$329.00</span>
                                </li>
                            </ul>
                        </div>

                        <Separator className="my-4" />
                        <div className="grid gap-3">
                            <div className="font-semibold">Add stock</div>
                            <dl className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <Form {...stockForm}>
                                        <form onSubmit={stockForm.handleSubmit(stockFormOnSubmit)}>
                                            <select name="" id="">
                                                <option value=""></option>
                                            </select>
                                            <input type="number" name="" id="" />
                                            <button type="submit">Add</button>
                                        </form>
                                    </Form>
                                </div>
                            </dl>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                            Updated <time dateTime="2023-11-23">November 23, 2023</time>
                        </div>
                    </CardFooter>
                </Card >
            </div >
        </main >
    )
}