export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="relative mx-auto py-2 w-[90vw] xl:max-w-screen-lg xl:w-auto">
        {children}
    </div>;
}