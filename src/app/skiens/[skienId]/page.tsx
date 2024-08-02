"use client"
import { Copy, MoreVertical, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { redirect } from "next/navigation";
import { InfoTable } from "~/app/_components/info_table";
import { useState } from "react";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

const stockFormSchema = z.object({
    location: z.string().min(1),
    stock: z.coerce.number()
});

export default function SkienPage({ params }: { params: { skienId: string } }) {
    const skien = api.skien.getByIdProtected.useQuery({ id: parseInt(params.skienId) });

    const skienInfo = skien.data?.info as Array<{ key: string; value: string }> ?? [];

    const [description, setDescription] = useState(skien.data?.description ?? "");
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const updateDescription = api.skien.updateDescription.useMutation({
        onSuccess: () => {
            revalidatePath(`/skiens/${params.skienId}`, 'page')
        }
    });

    const saveDescription = () => {
        if (!skien.data) return;
        updateDescription.mutate({
            id: skien.data.id,
            description
        });
        setIsEditingDescription(false);
    }

    const addStock = api.skien.updateStock.useMutation(
        {
            onSuccess: () => {
                revalidatePath(`/skiens/${params.skienId}`, 'page')
            }
        }
    );

    const updateInfo = api.skien.updateInfo.useMutation({
        onSuccess: () => {
            revalidatePath(`/skiens/${params.skienId}`, 'page')
        }
    });

    const deleteSkien = api.skien.delete.useMutation({
        onSuccess: () => redirect('/')
    })

    function handleDelete() {
        if (!skien.data) return undefined;
        deleteSkien.mutate({ id: skien.data?.id });
        redirect('/')
    }

    const stockForm = useForm<z.infer<typeof stockFormSchema>>({
        resolver: zodResolver(stockFormSchema),
        defaultValues: {
            location: "",
            stock: 0
        },
    })

    function stockFormOnSubmit(values: z.infer<typeof stockFormSchema>) {
        if (!skien.data) return;
        addStock.mutate({
            skienId: skien.data.id,
            ...values
        });
        stockForm.reset();
    }

    function handleInfoChange(info: Array<{ key: string; value: string }>) {
        if (!skien.data) return;
        updateInfo.mutate({
            id: skien.data.id,
            info
        });
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
                            <CardDescription className=" text-balance leading-relaxed">
                                <Textarea className={cn(isEditingDescription ? '' : 'bg-card')} onDoubleClick={() => setIsEditingDescription(!isEditingDescription)} value={description} onChange={(e) => setDescription(e.target.value)} readOnly={!isEditingDescription} onKeyDown={(e) => { if (e.keyCode === 13 && e.ctrlKey) saveDescription() }} />
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
                        <InfoTable info={skienInfo} onChange={handleInfoChange} />
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
                                    <DropdownMenuItem onClick={handleDelete}>Trash</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                        <div className="grid gap-3">
                            <div className="font-semibold">Stock</div>
                            <ul className="grid gap-3">
                                {skien.data?.skienStocks.map((stock) => (

                                    <li className="flex items-center justify-between" key={stock.id}>
                                        <span className="text-muted-foreground">
                                            {stock.location}
                                            <span className="text-xs ml-2">
                                                {stock.createdAt.toLocaleString("en-AU")}
                                            </span>
                                        </span>
                                        <span>{stock.stock}</span>
                                    </li>
                                ))}
                            </ul>
                            <Separator className="my-2" />
                            <ul className="grid gap-3">
                                <li className="flex items-center justify-between font-semibold">
                                    <span className="text-muted-foreground">Total</span>
                                    <span>{skien.data?.skienStocks.reduce((acc, curr) => acc + curr.stock, 0)}</span>
                                </li>
                            </ul>
                        </div>

                        <Separator className="my-4" />
                        <div className="grid gap-3">
                            <div className="font-semibold">Update stock</div>
                            <dl className="grid gap-3">
                                <Form {...stockForm}    >
                                    <form onSubmit={stockForm.handleSubmit(stockFormOnSubmit)} className="w-full gap-1 flex items-start justify-between">
                                        <FormField
                                            control={stockForm.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Location" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        <span className="text-muted-foreground text-xs">
                                                            Locations
                                                        </span>
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={stockForm.control}
                                            name="stock"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Stock" {...field} type="number" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        <span className="text-muted-foreground text-xs">
                                                            Stock?
                                                        </span>
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" size={"icon"} variant={"default"}>
                                            <Plus className="h-4 w-4" />
                                            <span className="sr-only">Add</span>
                                        </Button>
                                    </form>
                                </Form>
                            </dl>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                            Updated <time dateTime={skien.data?.updatedAt?.toLocaleString("en-AU")}>{skien.data?.updatedAt?.toLocaleString("en-AU")}</time>
                        </div>
                    </CardFooter>
                </Card >
            </div >
        </main >
    )
}