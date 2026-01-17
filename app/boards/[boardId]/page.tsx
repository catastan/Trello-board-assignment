import { getBoardData } from "@/app/actions/cards";
import BoardView from "@/app/components/BoardView";

export const dynamic = "force-dynamic";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;

  const dataInitial = await getBoardData(boardId);

  return (
    <main className="min-h-screen p-6 font-mono">
      <BoardView boardId={boardId} dataInitial={dataInitial} />
    </main>
  );
}
