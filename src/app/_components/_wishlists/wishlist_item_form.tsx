"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export function WishlistItemForm({ wishlistId }: { wishlistId: number }) {

    const utils = api.useUtils();
    const newItemSchema = z.object({
        name: z.string().min(1).max(256),
        description: z.preprocess(
            (foo) => {
                if (!foo || typeof foo !== 'string') return undefined
                return foo === '' ? undefined : foo
            },
            z.string().min(1).max(256).optional()
        ),
        link: z.preprocess(
            (foo) => {
                if (!foo || typeof foo !== 'string') return undefined
                return foo === '' ? undefined : foo
            }, z.string().min(1).max(256).url().optional()),
    });

    const newItemForm = useForm<z.infer<typeof newItemSchema>>({
        resolver: zodResolver(newItemSchema),
        defaultValues: {
            name: "",
            link: "",
        },
    });

    const addNewItem = api.wishlist.createWishlistItem.useMutation({
        onSuccess: () => {
            /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
            utils.wishlist.getWishListItems.invalidate({ wishlistId: wishlistId });
        }
    });

    const handleAddItem = (formValues: z.infer<typeof newItemSchema>) => {
        addNewItem.mutate({
            wishlistId: wishlistId,
            ...formValues
        });
        newItemForm.reset();

    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="text-xs" variant={"secondary"}>
                    <span className="flex items-center gap-2 justify-baseline">
                        <span >New item</span>
                        <Plus className="h-4 w-4" />
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New item</DialogTitle>
                </DialogHeader>
                <Form {...newItemForm} >
                    <form onSubmit={newItemForm.handleSubmit(handleAddItem)} className="space-y-8">
                        <FormField
                            control={newItemForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        <span className="text-muted-foreground text-xs">
                                            Name your wishlist item.
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={newItemForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        <span className="text-muted-foreground text-xs">
                                            Description of your wishlist item.
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={newItemForm.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Link" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        <span className="text-muted-foreground text-xs">
                                            Link to your wishlist item.
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit" size="sm" className="px-3" disabled={!newItemForm.formState.isValid || newItemForm.formState.isSubmitting}>
                                    <span className="flex items-center gap-2 justify-baseline">
                                        <span >Create</span>
                                        <Plus className="h-4 w-4" />
                                    </span>
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >

    );
}