"use client";

import type { CardDTO } from "@/app/actions/cards";

export default function CardItem({
  card,
  onOpen,
}: {
  card: CardDTO;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="text-left w-full rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition p-3"
      aria-label={`Open card: ${card.title}`}
    >
      <div className="font-semibold text-slate-900">{card.title}</div>
      {card.description ? (
        <div className="text-xs text-slate-600 mt-1 line-clamp-2">
          {card.description}
        </div>
      ) : (
        <div className="text-xs text-slate-400 mt-1">No description</div>
      )}
    </button>
  );
}
