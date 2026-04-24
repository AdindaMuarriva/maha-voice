const MobileContainer = ({ children }) => {
  return (
    // Background luar
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      
      {/* Container HP */}
      <div className="
        w-[330px] 
        h-[680px] 
        bg-white 
        shadow-[0_15px_40px_rgba(0,0,0,0.15)] 
        relative 
        overflow-hidden 
        rounded-[2.5rem]
        border-[3px] border-slate-900 
        flex flex-col
      ">
        
        {/* Konten aplikasi */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-white scrollbar-hide">
          {children}
        </main>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-900/10 rounded-full" />
        
      </div>
    </div>
  );
};

export default MobileContainer;