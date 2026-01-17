import { getBoards } from "@/app/actions/boards";
import BoardsGrid from "@/app/components/BoardsGrid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const boardsInitial = await getBoards();

  return (
    <main className="min-h-screen flex justify-center p-6 font-mono">
      <BoardsGrid boardsInitial={boardsInitial} />
    </main>
  );
}
