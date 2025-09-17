// =========================
// Supabase Auth Sign-in Logic
// =========================


// Fetch Supabase credentials from server
async function getSupabaseCredentials() {
    const res = await fetch('http://localhost:3001/api/supabase-credentials');
    if (!res.ok) throw new Error('Failed to fetch Supabase credentials');
    return await res.json();
}

// Load Supabase JS if not already loaded
if (window.supabase === undefined) {
    const supabaseScript = document.createElement('script');
    supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';
    document.head.appendChild(supabaseScript);
}

let supabaseClient;
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for Supabase JS to load
    function waitForSupabase() {
        return new Promise(resolve => {
            (function check() {
                if (window.supabase) return resolve();
                setTimeout(check, 50);
            })();
        });
    }
    await waitForSupabase();
    try {
        const creds = await getSupabaseCredentials();
        supabaseClient = window.supabase.createClient(creds.url, creds.key);
    } catch (err) {
        alert('Supabase config error: ' + err.message);
    }
});

// Sign-in form handler
const signinForm = document.getElementById('form-signin'); // Updated to match index.html
if (signinForm) {
    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Sign-in form submitted');
        if (!supabaseClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        console.log('Attempting sign-in with:', email);
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Sign-in error:', error);
            alert('Sign-in failed: ' + error.message);
        } else {
            console.log('Sign-in successful:', data);
            window.location.href = '/public/html/dashboard.html';
        }
    });
}
// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .about-content, .cta-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Button click animations
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// (Removed stats counter and observer after removing stats section)

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// =========================
// Auth Modal Logic
// =========================
const authOverlay = document.getElementById('auth-overlay');
const authModal = document.getElementById('auth-modal');
const authClose = document.getElementById('auth-close');
const tabSignin = document.getElementById('tab-signin');
const tabSignup = document.getElementById('tab-signup');
const panelSignin = document.getElementById('panel-signin');
const panelSignup = document.getElementById('panel-signup');

function openAuthModal() {
    authOverlay.classList.add('active');
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authOverlay.classList.remove('active');
    authModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Bind triggers to all "Get Started" buttons
document.querySelectorAll('.btn.btn-primary').forEach(btn => {
    if (btn.textContent.trim().toLowerCase().includes('get started') || btn.textContent.trim().toLowerCase().includes('book your first slot')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal();
        });
    }
});

// Close actions
authClose && authClose.addEventListener('click', closeAuthModal);
authOverlay && authOverlay.addEventListener('click', closeAuthModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) closeAuthModal();
});

// Tab switching
function setActiveTab(tab) {
    if (tab === 'signin') {
        tabSignin.classList.add('active');
        tabSignup.classList.remove('active');
        panelSignin.classList.add('active');
        panelSignup.classList.remove('active');
    } else {
        tabSignup.classList.add('active');
        tabSignin.classList.remove('active');
        panelSignup.classList.add('active');
        panelSignin.classList.remove('active');
    }
}

tabSignin && tabSignin.addEventListener('click', () => setActiveTab('signin'));
tabSignup && tabSignup.addEventListener('click', () => setActiveTab('signup'));

document.querySelectorAll('.auth-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-switch');
        setActiveTab(target);
    });
});

// Prevent form submission (demo only)
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: hook up real auth
        closeAuthModal();
    });
});

// Password visibility toggles
document.querySelectorAll('.toggle-visibility').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.getAttribute('data-target'));
        if (!input) return;
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        btn.textContent = isPassword ? '🙈' : '👁️';
        input.focus({ preventScroll: true });
        const end = input.value.length;
        input.setSelectionRange(end, end);
    });
});
