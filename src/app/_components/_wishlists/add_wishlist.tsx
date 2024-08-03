import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export function AddWishlist() {

    const wishlistSchema = z.object({
        name: z.string().min(1).max(100),
        public: z.coerce.boolean(),
    });

    const wishlistForm = useForm<z.infer<typeof wishlistSchema>>({
        resolver: zodResolver(wishlistSchema),
        defaultValues: {
            name: "",
        },
    })

    const createWishlist = api.wishlist.createWishlist.useMutation({
        onSuccess: (wishlist) => {
            wishlist[0]?.id && revalidatePath(`/wishlists`, 'page')
        }
    });

    const onSubmit = (values: z.infer<typeof wishlistSchema>) => {
        createWishlist.mutate(values);
    }

    return (
        <div>
            <h1>Add Wishlist</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Add Wishlist</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Wishlist</DialogTitle>
                    </DialogHeader>

                    <Form {...wishlistForm} >
                        <form onSubmit={wishlistForm.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={wishlistForm.control}
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
                                control={wishlistForm.control}
                                name="public"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Public</FormLabel>
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            <span className="text-muted-foreground text-xs">
                                                Is this wishlist public?
                                            </span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="submit" size="sm" className="px-3" disabled={!wishlistForm.formState.isValid || wishlistForm.formState.isSubmitting}>
                                        <span className="flex items-center gap-2 justify-baseline">
                                            <span >Create</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}