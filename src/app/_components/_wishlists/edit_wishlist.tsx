"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { Checkbox } from "~/components/ui/checkbox";

export function EditWishlistForm({ wishlistId }: { wishlistId: number }) {
    const wishListToEdit = api.wishlist.getPrivateWishlist.useQuery({
        id: wishlistId,
    });

    const utils = api.useUtils();
    const wishlistFormSchema = z.object({
        name: z.string().min(1).max(256),
        public: z.coerce.boolean(),
    });

    const editWishlistForm = useForm<z.infer<typeof wishlistFormSchema>>({
        resolver: zodResolver(wishlistFormSchema),
        defaultValues: {
            name: wishListToEdit.data?.name,
            public: wishListToEdit.data?.public
        }
    });

    const editWishlist = api.wishlist.updateWishlist.useMutation({
        onSuccess: () => {
            /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
            utils.wishlist.invalidate();

        }
    });

    const handleEditList = (formValues: z.infer<typeof wishlistFormSchema>) => {
        editWishlist.mutate({
            id: wishlistId,
            ...formValues
        });
        editWishlistForm.reset();

    }

    useEffect(() => {
        editWishlistForm.setValue("name", wishListToEdit.data?.name ?? "");
        editWishlistForm.setValue("public", wishListToEdit.data?.public ?? false);
    }, [wishListToEdit.data, editWishlistForm]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="text-xs" variant={"ghost"}>
                    <span className="flex items-center gap-2 justify-baseline">
                        <span >Edit list</span>
                        <Edit className="h-4 w-4" />
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Wishlist</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Edit your wishlist
                </DialogDescription>
                <Form {...editWishlistForm} >
                    <form onSubmit={editWishlistForm.handleSubmit(handleEditList)} className="space-y-8">
                        <FormField
                            control={editWishlistForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        <span className="text-muted-foreground text-xs">
                                            Name your wishlist.
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editWishlistForm.control}
                            name="public"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        <span className="text-muted-foreground text-xs">
                                            Is the list public?
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit" size="sm" className="px-3" disabled={!editWishlistForm.formState.isValid || editWishlistForm.formState.isSubmitting}>
                                    <span className="flex items-center gap-2 justify-baseline">
                                        <span >Update</span>
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