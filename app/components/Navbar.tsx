import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar h-16 px-6 py-[9px] border-b-[3px] border-[rgba(0,0,0,0.25)]">
      <div className="container mx-auto flex justify-end items-center">
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;