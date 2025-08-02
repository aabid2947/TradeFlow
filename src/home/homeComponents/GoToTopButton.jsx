import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const GoToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // This function will toggle the button's visibility based on scroll position
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // This function will smoothly scroll the page to the top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        // Listen for scroll events
        window.addEventListener('scroll', toggleVisibility);

        // Clean up the listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-28 right-0 md:right-6 z-50 p-3 rounded-full bg-trasnparent-600 hover:text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out animate-in fade-in-0 slide-in-from-bottom-5"
                    aria-label="Go to top"
                >
                    <ArrowUp className="h-7 w-7" />
                </button>
            )}
        </>
    );
};

export default GoToTopButton;