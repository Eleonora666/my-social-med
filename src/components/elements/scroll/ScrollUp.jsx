import React, { useState, useEffect } from 'react';

const ScrollUp = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Функция для отслеживания прокрутки
    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    };

    // Слушаем событие прокрутки
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Функция для прокрутки наверх
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <div>
            {showScrollButton && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    SCROLL UP
                </button>
            )}
        </div>
    );
};

export default ScrollUp;