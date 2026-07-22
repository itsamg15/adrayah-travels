document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Drawer
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a, button') : [];

    let touchStartX = 0;
    let touchEndX = 0;

    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuBackdrop) return;
        mobileMenuBackdrop.classList.remove('hidden');
        
        // requestAnimationFrame ensures the element is visible before transitioning
        requestAnimationFrame(() => {
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenuBackdrop.classList.remove('opacity-0');
        });
        document.body.classList.add('overflow-hidden');
        mobileMenuButton?.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuBackdrop) return;
        mobileMenu.classList.add('-translate-x-full');
        mobileMenuBackdrop.classList.add('opacity-0');
        
        setTimeout(() => {
            mobileMenuBackdrop.classList.add('hidden');
        }, 300); // 300ms matches the transition duration usually
        
        document.body.classList.remove('overflow-hidden');
        mobileMenuButton?.setAttribute('aria-expanded', 'false');
    }

    mobileMenuButton?.addEventListener('click', openMobileMenu);
    mobileMenuClose?.addEventListener('click', closeMobileMenu);
    mobileMenuBackdrop?.addEventListener('click', closeMobileMenu);

    mobileMenuLinks?.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.tagName === 'A' || link.tagName === 'BUTTON') {
                closeMobileMenu();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // Touch support: swipe left to close
    if (mobileMenu) {
        mobileMenu.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mobileMenu.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });
    }

    function handleSwipeGesture() {
        // if swiped left by more than 50px
        if (touchEndX < touchStartX - 50) {
            closeMobileMenu();
        }
    }
});
