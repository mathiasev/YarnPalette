import { SignInButton } from "@clerk/nextjs";

export function Guest() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <SignInButton />
            </div>
        </div>
    );
}