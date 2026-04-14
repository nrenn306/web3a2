/**
 * footer component for displaying website footer
 * 
 * props:
 * @param {Function} onAboutClick - callback function triggered when the "About Us" button is clicked
 */
function Footer({ onAboutClick }) {
    return (
        <footer className="w-full bg-[var(--dark)] text-white border-t border-[var(--muted)] mt-auto">
            <div className="flex justify-between items-center px-6 py-6 gap-6 w-full">
                {/* copyright text */}
                <p className="text-sm m-0">© 2026 Dotify</p>
                
                {/* actions/navigation */}
                <div className="flex gap-6 text-sm">
                    <a href="https://github.com/nrenn306/web3a2" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">GitHub</a>
                    <button onClick={onAboutClick} className="bg-[var(--accent)] text-[var(--black)] px-2 py-1 rounded cursor-pointer font-normal no-underline hover:text-white transition-colors">About Us</button>
                </div>
            </div>
        </footer>
    )
}

export default Footer;