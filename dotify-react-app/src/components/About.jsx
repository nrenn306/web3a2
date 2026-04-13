/**
 * About popup showing information and git link
 */
import { useEffect, useRef } from 'react';
import dotifylogo from '../assets/dotifylogo.png';

function About(props) {

    const aboutPop = useRef(null);
    const isOpen = props.isOpen;
    const onClose = props.onClose;

    // open/close popUp when isOpen changes
    useEffect(() => {

        const popUp = aboutPop.current;
        if (!popUp) {
            return;
        }

        isOpen ? popUp.showModal() : popUp.close();

    }, [isOpen]);

    // handle close when close or x are clicked
    const handleClose = () => {
        if (aboutPop.current) {
            aboutPop.current.close();
        }
        onClose();
    };

    return (
        <dialog ref={aboutPop} className="p-8 rounded border border-[var(--muted)] shadow-2xl max-w-sm w-90 bg-[var(--dark)] text-white" style={{ margin: 'auto', top: '50%', transform: 'translateY(-50%)' }}>
            
            <button onClick={handleClose} className="absolute top-4 right-4 bg-transparent border-none text-2xl cursor-pointer text-white p-0 w-8 h-8 flex items-center justify-center">
                ×
            </button>

            <img src={dotifylogo} alt="Dotify Logo" className="absolute top-4 left-4 h-20 w-20 rounded-full" />
            <div className="pl-4">
                <h1 className="text-2xl font-bold text-[var(--accent)] mb-4 mt-16">About Dotify</h1>   
                <h2 className="mb-4 text-white">
                    This app is a music discovery platform.
                </h2>

                <div className="mb-2">
                    <strong>Technologies Used</strong> 
                    <p>React, Vite, Tailwind, and Supabase</p>
                </div>

                <div className="mb-2">
                    <strong>Group Members</strong>
                    <p>Nicole Rennie & Seila Kennedy</p>
                </div>

                <div className="mb-6">
                    <strong>GitHub Link</strong>
                    <a href="https://github.com" className="text-[var(--accent)] no-underline ml-2">
                        <p>TO DO ADD LINK</p>
                    </a>
                </div>

                <button onClick={handleClose} className="bg-[var(--accent)] text-[var(--black)] px-2 py-1 rounded cursor-pointer font-normal no-underline hover:text-white transition-colors">
                    Close
                </button>
            </div>

        </dialog>
    );
}

export default About;
