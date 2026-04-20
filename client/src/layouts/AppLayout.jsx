import AmbientBackdrop from '../components/AmbientBackdrop';
import Sidebar from '../components/Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen text-ice">
      <AmbientBackdrop />
      <div className="relative mx-auto flex max-w-[1500px] gap-6 px-4 py-6 lg:px-6">
        <div className="hidden w-[300px] shrink-0 xl:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
