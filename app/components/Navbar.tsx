import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar p-4">
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