/** Slim bar fixed above the header. The header and page content are pushed down to make room for it. */
export default function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-40 flex h-9 items-center justify-center bg-biggs-yellow px-4 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-biggs-green sm:text-xs"
    >
      {text}
    </div>
  );
}
