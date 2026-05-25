export function LeoMartLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ fontSize: size }}
      className="font-bold text-[#4F46E5]"
    >
      LEO MART
    </div>
  );
}



export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 flex-col justify-center items-center p-12 text-white">
      <div className="text-center">
        
        <h2 className="text-4xl font-bold mb-4">
          Welcome to Leo Mart
        </h2>

        <p className="text-lg text-indigo-100 mb-8">
          Manage your shopping experience easily
        </p>

        <div className="w-48 h-48 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20"></div>
        </div>

      </div>
    </div>
  );
}