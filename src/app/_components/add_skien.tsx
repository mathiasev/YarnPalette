"use client"

import { ArrowRight, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { UploadButton } from "~/lib/uploadthing"


const formSchema = z.object({
    name: z.string().min(1).max(100),
    imageUrl: z.string().min(1),
})

export function AddSkienDialog() {

    const router = useRouter();

    const createSkien = api.skien.create.useMutation(
        {
            onSuccess: (skien) => {
                skien[0]?.id && router.push(`/skiens/${skien[0].id}`)
            }
        }
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createSkien.mutate(values);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size={"sm"} className="bg-secondary-foreground">
                    <span className="flex gap-2 items-center">
                        <Plus className="h-4 w-4" />
                        Add a skien
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Add a skien
                    </DialogTitle>
                    <DialogDescription>
                        Start adding a new skien to your collection.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        <span className="text-muted-foreground text-xs">
                                            Name your skien.
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                // Do something with the response
                                                console.log("Files: ", res);
                                                field.onChange(res[0]?.url ?? "");
                                                alert("Upload Completed");
                                            }}
                                            onUploadError={(error: Error) => {
                                                // Do something with the error.
                                                alert(`ERROR! ${error.message}`);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        <span className="text-muted-foreground text-xs">
                                            Upload an image of your skien.
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" size="sm" className="px-3" disabled={!form.formState.isValid}>
                                <span className="flex items-center gap-2 justify-baseline">
                                    <span >Create</span>
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
