import { YourSkiens } from "./_components/your-skiens";
import { Suspense } from "react";


export default async function Home() {

  return (
    <main className="flex  py-52  gap-y-14 flex-col items-center justify-center ">
      <Suspense>
        <YourSkiens />
      </Suspense>
    </main>
  );
}
