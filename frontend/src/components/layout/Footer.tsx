export function Footer() {
  return (
    <footer className="py-6 text-center">
      <nav className="flex items-center justify-center gap-4 text-xs text-[#9ca3af]">
        <a href="#" className="hover:text-[#e5e2e3] transition-colors">
          Privacy Policy
        </a>
        <span className="text-white/20">|</span>
        <a href="#" className="hover:text-[#e5e2e3] transition-colors">
          Terms of Service
        </a>
        <span className="text-white/20">|</span>
        <a href="#" className="hover:text-[#e5e2e3] transition-colors">
          System Status
        </a>
      </nav>
    </footer>
  );
}
