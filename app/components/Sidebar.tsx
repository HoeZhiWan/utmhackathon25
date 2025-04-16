import Link from 'next/link';

const Sidebar = () => {
  const sidebarLinks = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/projects', label: 'Device', icon: '🚀' },
    { href: '/teams', label: 'Solar Energy', icon: '👥' },
    { href: '/resources', label: 'Overview', icon: '📚' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="bg-secondary-dark w-64 min-h-screen flex flex-col">
      {/* Sidebar header that aligns with navbar */}
      <div className="p-3.5 bg-background flex items-center">
        <Link href="/" className="text-xl font-bold text-light">UTMxHackathon</Link>
      </div>
      
      {/* Sidebar content */}
      <div className="p-4 flex-1">
        <nav>
          <ul className="space-y-2">
            {sidebarLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href} 
                  className="flex items-center p-2 rounded-lg text-light hover:bg-primary-dark transition-colors"
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;