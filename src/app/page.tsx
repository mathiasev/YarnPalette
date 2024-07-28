import { LatestPosts } from "~/app/_components/post";
import { YourSkiens } from "./_components/skien";

export default async function Home() {

  return (
    <main className="flex  py-52  gap-y-14 flex-col items-center justify-center ">
      <YourSkiens />
      <LatestPosts />
    </main>
  );
}
