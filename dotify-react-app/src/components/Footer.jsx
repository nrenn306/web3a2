function Footer({ onAboutClick }) {
    return (
        <footer className="w-full bg-[var(--dark)] text-white border-t border-[var(--muted)] mt-auto">
            <div className="flex justify-between items-center px-6 py-6 gap-6 w-full">
                <p className="text-sm m-0">© 2026 Dotify</p>
                <div className="flex gap-6 text-sm">
                    <button onClick={onAboutClick} className="bg-[var(--accent)] text-[var(--black)] px-2 py-1 rounded cursor-pointer font-normal no-underline hover:text-white transition-colors">About Us</button>
                </div>
            </div>
        </footer>
    )
}

export default Footer;