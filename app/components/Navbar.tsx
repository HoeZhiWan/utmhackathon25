import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar h-16 px-6 py-[9px] border-b-[3px] border-[rgba(0,0,0,0.25)]">
      <div className="container mx-auto flex justify-end items-center">
        <div className="flex items-center space-x-3">
          {/* Notification Bell Icon */}
          <Link href="/admin" className="text-lg hover:opacity-80 transition-opacity">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Link>
          
          {/* Avatar with Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-neon-tint-400 hover:opacity-80 transition-opacity">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <p className="ml-3 text-m font-semibold text-foreground">John Doe</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;