document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    // Handle card flipping
    const cards = document.querySelectorAll('.therapy-card');
    
    cards.forEach(card => {
        const flipButtons = card.querySelectorAll('.btn-flip');
        
        flipButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close all other open cards
                cards.forEach(c => {
                    if (c !== card && c.classList.contains('flipped')) {
                        c.classList.remove('flipped');
                    }
                });
                
                // Toggle the clicked card
                card.classList.toggle('flipped');
                
                // Close card when clicking outside
                if (card.classList.contains('flipped')) {
                    const closeOnClickOutside = (e) => {
                        if (!card.contains(e.target)) {
                            card.classList.remove('flipped');
                            document.removeEventListener('click', closeOnClickOutside);
                        }
                    };
                    
                    // Add a small delay to prevent immediate closing
                    setTimeout(() => {
                        document.addEventListener('click', closeOnClickOutside);
                    }, 10);
                }
            });
        });
    });
    
    // Close card when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.therapy-card').forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });
});
