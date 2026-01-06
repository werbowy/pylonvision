/* ============================================================
   1. UTILITIES & INITIAL SETUP (Rok, Scroll, Mobile Menu)
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Force scroll top on reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);

    // Safe Year Update
    const currentFullYear = new Date().getFullYear();
    ['current-year', 'year', 'badge-year'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentFullYear;
    });

/* ============================================================
       1. UTILITIES & INITIAL SETUP (Rok, Scroll, Mobile Menu)
    ============================================================ */
    // ... (reszta kodu utilities) ...

    // Mobile Menu Logic (ULEPSZONE - Scroll Lock)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Ważne, żeby klik nie poszedł dalej
            
            mobileBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // EFEKT PREMIUM: Blokada przewijania tła
            if (mobileMenu.classList.contains('active')) {
                body.style.overflow = 'hidden'; // Zatrzymuje stronę
            } else {
                body.style.overflow = ''; // Puszcza stronę
            }
        });

        // Zamknij menu po kliknięciu w link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = ''; // Puszcza stronę
            });
        });

        // Zamknij menu klikając poza nie (opcjonalny bajer UX)
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileBtn.contains(e.target)) {
                
                mobileBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    if (cookieBanner && !localStorage.getItem('pylon_cookie_consent')) setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 2000);
    if (acceptBtn) acceptBtn.addEventListener('click', () => {
        localStorage.setItem('pylon_cookie_consent', 'true');
        cookieBanner.classList.remove('show');
    });
});

/* ============================================================
   2. NAVBAR SCROLL & PROGRESS BAR
============================================================ */
const scrollProgress = document.getElementById('scroll-progress');
const navbar = document.querySelector(".navbar");
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollPos = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Pasek postępu
            if (scrollProgress) scrollProgress.style.width = (scrollPos / totalHeight * 100) + "%";

            // Navbar state
            if (navbar) navbar.classList.toggle("scrolled", scrollPos > 50);

            ticking = false;
        });
        ticking = true;
    }
}, {
    passive: true
});

/* ============================================================
   3. 3D BANNER ANIMATION (Subscription Hero)
============================================================ */
const subHeroBanner = document.getElementById('subscription-hero');

if (subHeroBanner) {
    let rect = subHeroBanner.getBoundingClientRect();

    window.addEventListener('resize', () => {
        rect = subHeroBanner.getBoundingClientRect();
    });
    window.addEventListener('scroll', () => {
        rect = subHeroBanner.getBoundingClientRect();
    }, {
        passive: true
    });

    subHeroBanner.addEventListener('mousemove', e => {
        window.requestAnimationFrame(() => {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            subHeroBanner.style.setProperty('--mouse-x', `${x}px`);
            subHeroBanner.style.setProperty('--mouse-y', `${y}px`);

            const rotateX = (y - rect.height / 2) / 30; // 30 dla stabilności
            const rotateY = (rect.width / 2 - x) / 30;

            subHeroBanner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }, {
        passive: true
    });

    subHeroBanner.addEventListener('mouseleave', () => {
        window.requestAnimationFrame(() => {
            subHeroBanner.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
        });
    });
}

/* ============================================================
   4. INFINITY TICKER
============================================================ */
const ticker = document.getElementById('logoTicker');
const tickerWrap = document.querySelector('.ticker-wrap');

if (ticker) {
    // Clone items for infinite loop
    const items = Array.from(ticker.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        ticker.appendChild(clone);
    });

    // Pause when off-screen
    if (tickerWrap) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };
        const tickerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ticker.classList.remove('paused');
                } else {
                    ticker.classList.add('paused');
                }
            });
        }, observerOptions);
        tickerObserver.observe(tickerWrap);
    }
}

/* ============================================================
   5. COURSE LIBRARY & FILTERS
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const pylonCourses = [{
            id: 1,
            title: "E-Commerce Mastery",
            category: "business",
            price: "$49",
            image: "images/image1.png" ,
            desc: "Start your dropshipping journey with a solid plan. We teach you how to set up your store, find reliable suppliers, and choose products with potential.",
            url: "#"
        },
        {
            id: 2,
            title: "Agency Architect",
            category: "business",
            price: "$99",
            image: "images/image2.png",
            desc: "Learn how to build organize and scale a marketing agency. We show you proven strategies to find clients and manage your projects.",
            url: "#"
        },
        {
            id: 3,
            title: "Copywriter Secrets",
            category: "business",
            price: "$29",
            image: "images/image3.png",
            desc: "Discover how to write texts that persuades people to buy easily. You will learn the psychology behind sales and how to present your offers effectively.",
            url: "#"
        },
        {
            id: 4,
            title: "Market Strategy",
            category: "trading",
            price: "$79",
            image: "images/image4.png",
            desc: "Learn the way of trading and technical analysis. We teach you how to read charts, manage risk, and think like a professional investor.",
            url: "#"
        },
        {
            id: 5,
            title: "Faceless Influencer",
            category: "social",
            price: "$39",
            image: "images/image5.png",
            desc: "Learn how to run a YouTube channel without showing your face. We explain how to choose the right topics and create content efficiently.",
            url: "#"
        },
        {
            id: 6,
            title: "Prime Dropshipping",
            category: "business",
            price: "$49",
            image: "images/image6.png",
            desc: "Learn how to sell on Amazon, the world’s largest marketplace. We explain the FBA model and how to use Amazon’s logistics.",
            url: "#"
        },
        {
            id: 7,
            title: "Deal Closing Expert",
            category: "business",
            price: "$99",
            image: "images/image7.png",
            desc: "Improve your sales skills and learn how to close deals over the phone. We provide you with scripts and frameworks used by professional salespeople.",
            url: "#"
        },
        {
            id: 8,
            title: "Insta Money",
            category: "social",
            price: "$19",
            image: "images/image8.png",
            desc: "Learn strategies to grow on Social Media and engage your followers. We show you how to build an audience and the different ways to monetize your page.",
            url: "#"
        },
        {
            id: 9,
            title: "The Founder Playbook",
            category: "business",
            price: "$197",
            image: "images/image9.png",
            desc: "Learn how to build a paid community around your brand. We guide you through the process of turning your knowledge into a subscription business.",
            url: "#"
        }
    ];

    const gridContainer = document.getElementById('courseGrid');
    const searchInput = document.getElementById('courseSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');

    function renderCourses(data) {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        // Dynamic Date
        const date = new Date();
        const currentDate = date.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        // Stats Configuration
        const courseStats = {
            1: { rating: 4.9, reviews: 28, oldPrice: 80, badgeType: 'USER_FAV' },
            2: { rating: "5.0", reviews: 7, oldPrice: 155, badgeType: 'ELITE_PICK' },
            3: { rating: 4.7, reviews: 14, oldPrice: 50, badgeType: 'NONE' },
            4: { rating: 4.8, reviews: 9, oldPrice: 125, badgeType: 'NONE' },
            5: { rating: 4.6, reviews: 32, oldPrice: 65, badgeType: 'TRENDING' },
            6: { rating: 4.8, reviews: 21, oldPrice: 80, badgeType: 'NONE' },
            7: { rating: 4.9, reviews: 5, oldPrice: 155, badgeType: 'TOP_RATED' },
            8: { rating: 4.7, reviews: 54, oldPrice: 36, badgeType: 'BESTSELLER' },
            9: { rating: "5.0", reviews: 3, oldPrice: 302, badgeType: 'ELITE_PICK' }
        };

        data.forEach((course, index) => {
            const stats = courseStats[course.id] || { rating: 4.5, reviews: 5, oldPrice: 100, badgeType: 'NONE' };
            const currentVal = parseInt(course.price.replace('$', ''));
            const originalPrice = `$${stats.oldPrice}`;
            const discountPercent = Math.round(((stats.oldPrice - currentVal) / stats.oldPrice) * 100);

            // Badge HTML
            let badgeHTML = '';
            if (stats.badgeType === 'USER_FAV') {
                badgeHTML = `<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 50%, #d1d5db 100%); color: #111827; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #ffffff; box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);"><i class="fa-solid fa-gem" style="margin-right: 4px;"></i> LIMITED DROP</div>`;
            } else if (stats.badgeType === 'BESTSELLER') {
                badgeHTML = `<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3); box-shadow: 0 4px 15px rgba(184, 134, 11, 0.4); border: 1px solid rgba(255, 255, 255, 0.2);"><i class="fa-solid fa-crown"></i> Bestseller</div>`;
            } else if (stats.badgeType === 'ELITE_PICK') {
                badgeHTML = `<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #8B5CF6, #D946EF); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);"><i class="fa-solid fa-crown""></i> Elite Pick</div>`;
            } else if (stats.badgeType === 'TRENDING') {
                badgeHTML = `<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #10B981, #059669); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);"><i class="fa-solid fa-arrow-trend-up"></i> Trending</div>`;
            } else if (stats.badgeType === 'TOP_RATED') {
                badgeHTML = `<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #6366f1, #4f46e5); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);"><i class="fa-solid fa-star"></i> Top Rated</div>`;
            }

            // Stars HTML
            let starsIconHTML = '';
            if (stats.rating >= 4.8) {
                starsIconHTML = `<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>`;
            } else if (stats.rating >= 4.3) {
                starsIconHTML = `<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>`;
            } else {
                starsIconHTML = `<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i>`;
            }

            const card = document.createElement('div');
            card.className = 'course-card';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    ${badgeHTML}
                    <img src="${course.image}" alt="${course.title}" class="card-image" loading="lazy">
                </div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 5px;">
                        <h3 class="card-title" style="margin-bottom:0; font-size: 1.25rem;">${course.title}</h3>
                    </div>
                    
                    <div style="font-size: 0.8rem; color: #FBBF24; margin-bottom: 12px; display: flex; align-items: center; gap: 5px;">
                        <div style="display:flex; gap:1px;">${starsIconHTML}</div>
                        <span style="color: var(--text-muted); font-weight: 500; margin-left: 4px;">${stats.rating} (${stats.reviews} Ratings)</span>
                    </div>

                    <div style="font-size: 0.75rem; color: #10B981; margin-bottom: 10px; font-weight:700; display:flex; align-items:center; gap:6px; letter-spacing: -0.02em;">
                        <i class="fa-solid fa-rotate" style="font-size: 0.8em;"></i> Updated for ${currentDate}
                    </div>

                    <p class="card-desc">${course.desc}</p>
                    
                    <div class="card-footer" style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div class="price-box">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <span class="old-price">${originalPrice}</span>
                                <span style="background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.25); font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-family: var(--font-code); letter-spacing: -0.5px;">-${discountPercent}%</span>
                            </div>
                            <span class="card-price" style="color: var(--primary-glow); font-family: var(--font-code); font-weight: 800; font-size: 1.6rem;">
                                ${course.price}
                            </span>
                            <div style="font-size: 0.65rem; color: #9CA3AF; margin-top: 4px; display:flex; align-items:center; gap:4px;">
                                <i class="fa-solid fa-shield-halved"></i> 30-Day Guarantee
                            </div>
                        </div>
                        
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:5px;">
                            <a href="${course.url}" class="btn-card" style="padding: 10px 24px; font-size: 0.9rem;">
                                Get Access
                            </a>
                            <span style="font-size: 0.65rem; color: #A78BFA; font-weight:600;">
                                <i class="fa-solid fa-bolt"></i> Instant Access
                            </span>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    renderCourses(pylonCourses);

    // Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');
            const term = searchInput.value.toLowerCase();
            const filtered = pylonCourses.filter(course => {
                const matchesCategory = category === 'all' || course.category === category;
                const matchesSearch = course.title.toLowerCase().includes(term);
                return matchesCategory && matchesSearch;
            });
            renderCourses(filtered);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const activeBtn = document.querySelector('.filter-btn.active');
            const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            const filtered = pylonCourses.filter(course => {
                const matchesCategory = category === 'all' || course.category === category;
                const matchesSearch = course.title.toLowerCase().includes(term);
                return matchesCategory && matchesSearch;
            });
            renderCourses(filtered);
        });
    }
});

/* ============================================================
   6. PROOF PULSE (Fake Notifications)
============================================================ */
const productActions = [
    { title: "E-Commerce Mastery", color: "#84CC16" },
    { title: "Agency Architect", color: "#3B82F6" },
    { title: "Copywriter Secrets", color: "#10B981" },
    { title: "Market Strategy", color: "#00FF9D" },
    { title: "Faceless Influencer", color: "#FF0000" },
    { title: "Prime Dropshipping", color: "#FF9900" },
    { title: "Deal Closing Expert", color: "#22D3EE" },
    { title: "Insta Money", color: "#D946EF" },
    { title: "The Founder Playbook", color: "#FACC15" }
];

const globalDatabase = {
    anglo: { weight: 0.40, countries: ["United States", "United Kingdom", "Canada", "Australia", "New Zealand"], names: ["James", "Michael", "Robert", "John", "David", "William", "Richard", "Joseph", "Thomas", "Sarah", "Jessica"] },
    dach: { weight: 0.20, countries: ["Germany", "Austria", "Switzerland", "Netherlands"], names: ["Maximilian", "Alexander", "Paul", "Elias", "Leon", "Sophie", "Maria", "Hannah"] },
    latin: { weight: 0.15, countries: ["France", "Italy", "Spain", "Portugal"], names: ["Gabriel", "Léo", "Raphaël", "Arthur", "Sofia", "Giulia", "Alice"] },
    nordic: { weight: 0.10, countries: ["Sweden", "Norway", "Denmark", "Finland"], names: ["William", "Liam", "Noah", "Alice", "Maja"] },
    central: { weight: 0.10, countries: ["Poland", "Czech Republic", "Slovakia"], names: ["Jakub", "Antoni", "Jan", "Julia", "Zuzanna"] },
    global: { weight: 0.05, countries: ["Singapore", "Japan", "UAE", "Brazil"], names: ["Wei", "Hiroshi", "Ahmed", "Lucas", "Li", "Sakura"] }
};

const pulseElement = document.getElementById('proof-pulse');
const imgElement = document.getElementById('proof-img');
const nameElement = document.getElementById('proof-name');
const locElement = document.getElementById('proof-loc');
const infoContainer = document.querySelector('.proof-info');

function getWeightedRegion() {
    const rand = Math.random();
    let sum = 0;
    for (const key in globalDatabase) {
        sum += globalDatabase[key].weight;
        if (rand <= sum) return globalDatabase[key];
    }
    return globalDatabase.anglo;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function showRealisticNotification() {
    if (!pulseElement) return;

    const region = getWeightedRegion();
    const country = getRandomItem(region.countries);
    const firstName = getRandomItem(region.names);
    const lastInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const fullName = `${firstName} ${lastInitial}.`;
    const product = getRandomItem(productActions);
    const timeAgo = Math.random() > 0.8 ? "Just now" : Math.floor(Math.random() * 59) + 1 + "m ago";
    const avatarSeed = `${firstName}+${lastInitial}`;

    imgElement.src = `https://ui-avatars.com/api/?name=${avatarSeed}&background=random&color=fff&rounded=true&size=128&bold=true&format=svg`;
    nameElement.textContent = fullName;
    locElement.textContent = country;

    const actionLine = infoContainer.querySelector('div:last-child');
    actionLine.innerHTML = `
        <span style="color: #9CA3AF;">Purchased</span>
        <span style="color:${product.color}; font-weight:700; font-size: 0.85rem;">${product.title}</span> 
        <span style="opacity:0.5; font-size: 0.75rem; margin-left: 6px; white-space: nowrap; display: inline-flex; align-items: center;">
            <i class="fa-regular fa-clock" style="font-size:0.7rem; margin-right:3px;"></i> ${timeAgo}
        </span>
    `;

    pulseElement.classList.add('visible');
    setTimeout(() => {
        pulseElement.classList.remove('visible');
        const nextInterval = Math.random() * 16000 + 8000;
        setTimeout(showRealisticNotification, nextInterval);
    }, 6000);
}

setTimeout(showRealisticNotification, 4500);

/* ============================================================
   7. CONSTELLATION ANIMATION (CANVAS)
============================================================ */
(function() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Mniej cząsteczek na mobile, więcej na desktopie
    const particleCount = window.innerWidth < 768 ? 20 : 45;
    const connectionDistance = 150;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${1 - distance/connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    init();
    animate();
})();

/* ============================================================
   8. ROI CALCULATOR
============================================================ */
const hoursSlider = document.getElementById('hours-slider');
const rateSlider = document.getElementById('rate-slider');

if (hoursSlider && rateSlider) {
    function updateCalc() {
        const hours = hoursSlider.value;
        const rate = rateSlider.value;
        document.getElementById('hours-display').textContent = hours;
        document.getElementById('rate-display').textContent = `$${rate}`;
        document.getElementById('result-display').textContent = `$${(hours * rate * 12).toLocaleString()}`;
    }
    hoursSlider.addEventListener('input', updateCalc);
    rateSlider.addEventListener('input', updateCalc);
    updateCalc(); // Initialize
}

/* ============================================================
   9. SCROLL REVEAL & FAQ INTERACTION
============================================================ */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// FAQ Logic
const faqList = document.getElementsByClassName("faq-question");
for (let i = 0; i < faqList.length; i++) {
    faqList[i].addEventListener("click", function() {
        for (let j = 0; j < faqList.length; j++) {
            if (faqList[j] !== this) {
                faqList[j].classList.remove("active");
                faqList[j].nextElementSibling.style.maxHeight = null;
            }
        }
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
    });
}

// Countdown Timer & Mouse Effects
function startDailyCountdown() {
    const display = document.querySelector('#countdown');
    if (!display) return;
    function updateTimer() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        let diff = endOfDay - now;
        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);
        display.textContent = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
    setInterval(updateTimer, 1000);
    updateTimer();
}
startDailyCountdown();

document.querySelectorAll('.bento-card').forEach(card => {
    card.onmousemove = e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
});

/* ============================================================
   10. MODAL FUNCTIONS (Global Scope)
============================================================ */
window.openLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};
window.closeLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.closeSignupModal = () => {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.switchToSignup = () => {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('signup-modal').style.display = 'flex';
};

window.switchToLogin = () => {
    document.getElementById('signup-modal').style.display = 'none';
    document.getElementById('login-modal').style.display = 'flex';
};

// Generic Modal Openers
const modalMap = {
    'privacy-modal': ['openPrivacyModal', 'closePrivacyModal'],
    'terms-modal': ['openTermsModal', 'closeTermsModal'],
    'about-modal': ['openAboutModal', 'closeAboutModal'],
    'story-modal': ['openStoryModal', 'closeStoryModal'],
    'roadmap-modal': ['openRoadmapModal', 'closeRoadmapModal']
};

Object.keys(modalMap).forEach(id => {
    const [openFn, closeFn] = modalMap[id];
    window[openFn] = () => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };
    window[closeFn] = () => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

/* ============================================================
   11. DASHBOARD ANIMATION
============================================================ */
function initDashboard() {
    const stats = [
        { id: 'dash-revenue', barId: 'bar-revenue', end: 9349, max: 10000 },
        { id: 'dash-bots', barId: 'bar-bots', end: 72, max: 100 },
        { id: 'dash-hours', barId: 'bar-hours', end: 144, max: 150 }
    ];

    stats.forEach(stat => {
        const numberEl = document.getElementById(stat.id);
        const barEl = document.getElementById(stat.barId);
        if (!numberEl || !barEl) return;

        let startTime = null;
        const duration = 2000;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentVal = Math.floor(progress * stat.end);
            numberEl.innerText = currentVal;
            const barWidth = (stat.end / stat.max) * progress * 100;
            barEl.style.width = barWidth + "%";

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                numberEl.innerText = stat.end;
                barEl.style.width = (stat.end / stat.max * 100) + "%";
            }
        }
        window.requestAnimationFrame(step);
    });

    // Log Animation
    const logContainer = document.getElementById('dash-log-lines');
    if (logContainer) logContainer.innerHTML = '';

    const logLines = [
        "System initialized...",
        "Deployment successful.",
        "72 Active automations verified.",
        "Syncing Shopify API...",
        "144 Hours recovered this month."
    ];

    let lineIdx = 0;

    function addLog() {
        if (logContainer && lineIdx < logLines.length) {
            const div = document.createElement('div');
            div.className = 'log-line';
            div.innerText = "> " + logLines[lineIdx];
            logContainer.appendChild(div);
            lineIdx++;
            setTimeout(addLog, 800);
        }
    }
    setTimeout(addLog, 500);
}

const dashObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        initDashboard();
        dashObserver.unobserve(entries[0].target);
    }
}, {
    threshold: 0.3
});
const dashTarget = document.querySelector('.hero-dashboard');
if (dashTarget) dashObserver.observe(dashTarget);

/* ============================================================
   12. PROMO TEXT & MEGA MENU SETUP
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Promo Text
    const promoTextElement = document.getElementById('promo-text');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyPromos = [
        `🔥 NEW YEAR PROMO ${currentYear}: 30% OFF – Ends at 11:59 Tonight! 💸`,
        `🚀 FEBRUARY BOOST: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `💎 MARCH GROWTH: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `⚡ SPRING SALE: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `🛠️ MAY UPGRADE: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `☀️ SUMMER DEALS: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `🚀 JULY SPECIAL: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `🔥 AUGUST FINALE: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `💼 SEPTEMBER START: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `🎃 HALLOWEEN PROMO: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `⚫ BLACK FRIDAY DEALS: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
        `🎄 XMAS PROTOCOL: 30%+ OFF – Ends at 11:59 Tonight! 💸`
    ];

    if (promoTextElement) {
        promoTextElement.innerText = monthlyPromos[currentMonth];
    }

    // Mega Menu
    const megaCourses = [
        { title: "Ecom", img: "images/image1.png" }, { title: "Agency", img: "images/image2.png" },
        { title: "Dropship", img: "images/image6.png" }, { title: "Closing", img: "images/image7.png" },
        { title: "Founder", img: "images/image9.png" }, { title: "YouTube", img: "images/image5.png" },
        { title: "Trading", img: "images/image4.png" }, { title: "Copy", img: "images/image3.png" },
        { title: "Social", img: "images/image8.png" }
    ];

    const megaTarget = document.getElementById('mega-grid-target');
    const menu = document.getElementById('academy-mega-menu');
    const trigger = document.getElementById('academy-trigger');
    const closeBtn = document.getElementById('mega-close-btn');

    window.scrollToLibrary = () => {
        if (menu) menu.classList.remove('show');
        const libSection = document.getElementById('library');
        if (libSection) libSection.scrollIntoView({ behavior: 'smooth' });
    };

    if (megaTarget) {
        megaTarget.innerHTML = megaCourses.map(c => `
            <div class="mega-item" onclick="scrollToLibrary()">
                <div class="mega-img-wrap"><img src="${c.img}" alt="${c.title}" loading="lazy"></div>
                <span>${c.title}</span>
            </div>
        `).join('');
    }

    function toggleMenu(show) {
        if (show) {
            menu.style.display = 'block';
            setTimeout(() => menu.classList.add('show'), 10);
            if (trigger) trigger.classList.add('active');
        } else {
            menu.classList.remove('show');
            if (trigger) trigger.classList.remove('active');
            setTimeout(() => {
                if (!menu.classList.contains('show')) menu.style.display = 'none';
            }, 400);
        }
    }

    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(!menu.classList.contains('show'));
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(false);
        });
    }

    document.addEventListener('click', (e) => {
        if (menu && !menu.contains(e.target) && e.target !== trigger) {
            toggleMenu(false);
        }
    });

    // Email Protection (Footer)
    const link = document.getElementById('contact-link');
    const text = document.getElementById('contact-text');
    const user = 'contact';
    const domain = 'pylonvision.com';

    if (link && text) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `mailto:${user}@${domain}`;
        });
        text.textContent = `${user}@${domain}`;
    }

    // Email Protection (Modal)
    const modalLink = document.getElementById('modal-contact-link');
    const modalText = document.getElementById('modal-contact-text');
    if (modalLink && modalText) {
        modalText.innerText = `${user}@${domain}`;
        modalLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `mailto:${user}@${domain}`;
        });
    }
});

/* ============================================================
   13. EMAIL PROTECTION (General)
============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    // Protector 1
    document.querySelectorAll('.email-protector').forEach(link => {
        const user = link.getAttribute('data-user');
        const domain = link.getAttribute('data-domain');
        const fullEmail = user + '@' + domain;
        link.setAttribute('href', 'mailto:' + fullEmail);
        const textSpan = link.querySelector('.email-text');
        if (textSpan) textSpan.textContent = fullEmail;
    });

    // Protector 2 (Text based)
    document.querySelectorAll('.protected-email').forEach(el => {
        let email = el.innerText.replace(' [at] ', '@');
        el.innerHTML = `<a href="mailto:${email}" style="color: inherit; text-decoration: none;">${email}</a>`;
    });

});

    /* ============================================================
       DYNAMICZNA DATA W REGULAMINACH (Wersja HTML - Zielona)
    ============================================================ */
    document.addEventListener("DOMContentLoaded", function() {
        const dateElements = document.querySelectorAll('.effective-date');
        
        if (dateElements.length > 0) {
            const now = new Date();
            // Obliczamy 1. dzień obecnego kwartału (styczeń, kwiecień, lipiec, październik)
            const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
            const finalDate = new Date(now.getFullYear(), quarterMonth, 1);
            
            // Ustawienia formatowania daty (np. January 1, 2026)
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            const formattedDate = finalDate.toLocaleDateString('en-US', options);
            
            // Wstawiamy datę i kolorujemy na ZIELONO
            dateElements.forEach(el => {
                el.innerText = `Last Updated: ${formattedDate}`;
                el.style.color = "#10B981"; // Twój kolor (Pylon Green)
                el.style.fontWeight = "600"; // Lekkie pogrubienie dla lepszego efektu
            });
        }
    });


    const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.nav-links');
const body = document.body;

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        mobileBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Lock/unlock body scroll
        if (mobileMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close menu when clicking links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileBtn.contains(e.target)) {
            
            mobileBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
}