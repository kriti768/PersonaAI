export default function AmbientBackdrop() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,154,98,0.18),transparent_18%),radial-gradient(circle_at_80%_12%,rgba(192,108,255,0.3),transparent_22%),radial-gradient(circle_at_62%_72%,rgba(142,77,255,0.22),transparent_30%),linear-gradient(180deg,#2a1550_0%,#1a0f2f_48%,#130a22_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-grid bg-[length:84px_84px] opacity-[0.1]" />
      <div className="pointer-events-none fixed -left-16 top-10 h-72 w-72 rounded-full bg-ember/20 blur-3xl" />
      <div className="pointer-events-none fixed right-[-70px] top-0 h-96 w-96 rounded-full bg-iris/20 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-140px] left-[24%] h-96 w-96 rounded-full bg-violet/18 blur-3xl" />
    </>
  );
}
