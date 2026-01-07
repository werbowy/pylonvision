/* ============================================================
   PYLON VISION - Enhanced JavaScript
   Improved for better functionality and error resilience
============================================================ */

// ========== 1. UTILITY FUNCTIONS ==========
const utils = {
    // Safely get element by ID with error handling
    getElement: (id) => {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.warn(`Element with id "${id}" not found`);
            return null;
        }
    },

    // Safely query selector
    query: (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Selector "${selector}" invalid`);
            return null;
        }
    },

    // Safely query all
    queryAll: (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Selector "${selector}" invalid`);
            return [];
        }
    },

    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Safe local storage
    storage: {
        get: (key) => {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch {
                return false;
            }
        }
    }
};

// ========== 2. INITIAL SETUP ==========
document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on page load
    try {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        if (window.location.hash) {
            history.replaceState("", document.title, window.location.pathname + window.location.search);
        }
        setTimeout(() => window.scrollTo(0, 0), 0);
    } catch (error) {
        console.error('Scroll setup error:', error);
    }

    // Update year dynamically
    const currentYear = new Date().getFullYear();
    ['current-year', 'year', 'badge-year'].forEach(id => {
        const el = utils.getElement(id);
        if (el) el.textContent = currentYear;
    });

    // Initialize all modules
    MobileMenu.init();
    CookieBanner.init();
    NavbarScroll.init();
    ProofPulse.init();
    ROICalculator.init();
    CourseLibrary.init();
    FAQ.init();
    Modals.init();
    Dashboard.init();
    PromoText.init();
    MegaMenu.init();
    EmailProtection.init();
});

// ========== 3. MOBILE MENU MODULE ==========
const MobileMenu = {
    init() {
        const btn = utils.query('.mobile-menu-btn');
        const menu = utils.query('.nav-links');

        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle(btn, menu);
        });

        // Close on link click - Z POPRAWKĄ DLA ACADEMY
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // WAŻNE: Sprawdzamy czy to Academy lub czy kliknięcie jest wewnątrz Mega Menu
                if (link.id === 'academy-trigger' || link.closest('.mega-menu')) {
                    // Jeśli tak, to przerywamy funkcję i NIE zamykamy menu
                    return; 
                }
                
                // Dla każdego innego linku - zamykamy menu
                this.close(btn, menu);
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            // Ignorujemy kliknięcia wewnątrz Mega Menu
            if (e.target.closest('.mega-menu') || e.target.closest('#academy-trigger')) {
                return;
            }

            if (menu.classList.contains('active') &&
                !menu.contains(e.target) &&
                !btn.contains(e.target)) {
                this.close(btn, menu);
            }
        });
    },

    toggle(btn, menu) {
        const isActive = menu.classList.toggle('active');
        btn.classList.toggle('active', isActive);
        
        // Blokujemy scrollowanie strony pod spodem
        document.body.style.overflow = isActive ? 'hidden' : '';
    },

    close(btn, menu) {
        btn.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Dodatkowo zamykamy Mega Menu jeśli jest otwarte
        const megaMenu = document.getElementById('academy-mega-menu');
        const megaOverlay = document.getElementById('mega-overlay');
        if(megaMenu) megaMenu.classList.remove('show');
        if(megaOverlay) megaOverlay.classList.remove('show');
    }
};

// ========== 4. COOKIE BANNER MODULE ==========
const CookieBanner = {
    init() {
        const banner = utils.getElement('cookie-banner');
        const acceptBtn = utils.getElement('accept-cookies');

        if (!banner) return;

        if (!utils.storage.get('pylon_cookie_consent')) {
            setTimeout(() => banner?.classList.add('show'), 2000);
        }

        acceptBtn?.addEventListener('click', () => {
            utils.storage.set('pylon_cookie_consent', 'true');
            banner.classList.remove('show');
        });
    }
};

// ========== 5. NAVBAR SCROLL & PROGRESS ==========
const NavbarScroll = {
    init() {
        const navbar = utils.query('.navbar');
        const progress = utils.getElement('scroll-progress');

        const handleScroll = utils.throttle(() => {
            const scrollPos = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (progress && totalHeight > 0) {
                const percent = Math.min((scrollPos / totalHeight * 100), 100);
                progress.style.width = `${percent}%`;
            }

            navbar?.classList.toggle('scrolled', scrollPos > 50);
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
};

// ========== 6. 3D SUBSCRIPTION BANNER ==========
const SubBanner = {
    init() {
        const banner = utils.getElement('subscription-hero');
        if (!banner) return;

        let rect = banner.getBoundingClientRect();

        const updateRect = () => {
            rect = banner.getBoundingClientRect();
        };

        window.addEventListener('resize', utils.debounce(updateRect, 200));
        window.addEventListener('scroll', utils.throttle(updateRect, 100), { passive: true });

        banner.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                banner.style.setProperty('--mouse-x', `${x}px`);
                banner.style.setProperty('--mouse-y', `${y}px`);

                const rotateX = (y - rect.height / 2) / 30;
                const rotateY = (rect.width / 2 - x) / 30;

                banner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }, { passive: true });

        banner.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                banner.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
            });
        });
    }
};

// Initialize Sub Banner
window.addEventListener('DOMContentLoaded', () => SubBanner.init());

// ========== 7. INFINITY TICKER ==========
const Ticker = {
    init() {
        const ticker = utils.getElement('logoTicker');
        const wrap = utils.query('.ticker-wrap');

        if (!ticker) return;

        // Clone items for infinite scroll
        Array.from(ticker.children).forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            ticker.appendChild(clone);
        });

        // Pause when off-screen
        if (wrap) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    ticker.classList.toggle('paused', !entry.isIntersecting);
                });
            }, { threshold: 0 });

            observer.observe(wrap);
        }
    }
};

window.addEventListener('DOMContentLoaded', () => Ticker.init());

// ========== 8. COURSE LIBRARY MODULE ==========
const CourseLibrary = {
    courses: [
        { id: 1, title: "E-Commerce Mastery", category: "business", price: "$49", image: "images/image1.png", desc: "Start your dropshipping journey with a solid plan. We teach you how to set up your store, find reliable suppliers, and choose products with potential.", url: "#" },
        { id: 2, title: "Agency Architect", category: "business", price: "$99", image: "images/image2.png", desc: "Learn how to build organize and scale a marketing agency. We show you proven strategies to find clients and manage your projects.", url: "#" },
        { id: 3, title: "Copywriter Secrets", category: "business", price: "$29", image: "images/image3.png", desc: "Discover how to write texts that persuades people to buy easily. You will learn the psychology behind sales and how to present your offers effectively.", url: "#" },
        { id: 4, title: "Market Strategy", category: "trading", price: "$79", image: "images/image4.png", desc: "Learn the way of trading and technical analysis. We teach you how to read charts, manage risk, and think like a professional investor.", url: "#" },
        { id: 5, title: "Faceless Influencer", category: "social", price: "$39", image: "images/image5.png", desc: "Learn how to run a YouTube channel without showing your face. We explain how to choose the right topics and create content efficiently.", url: "#" },
        { id: 6, title: "Prime Dropshipping", category: "business", price: "$49", image: "images/image6.png", desc: "Learn how to sell on Amazon, the world's largest marketplace. We explain the FBA model and how to use Amazon's logistics.", url: "#" },
        { id: 7, title: "Deal Closing Expert", category: "business", price: "$99", image: "images/image7.png", desc: "Improve your sales skills and learn how to close deals over the phone. We provide you with scripts and frameworks used by professional salespeople.", url: "#" },
        { id: 8, title: "Insta Money", category: "social", price: "$19", image: "images/image8.png", desc: "Learn strategies to grow on Social Media and engage your followers. We show you how to build an audience and the different ways to monetize your page.", url: "#" },
        { id: 9, title: "The Founder Playbook", category: "business", price: "$197", image: "images/image9.png", desc: "Learn how to build a paid community around your brand. We guide you through the process of turning your knowledge into a subscription business.", url: "#" }
    ],

    stats: {
        1: { rating: 4.9, reviews: 28, oldPrice: 80, badgeType: 'USER_FAV' },
        2: { rating: "5.0", reviews: 7, oldPrice: 155, badgeType: 'ELITE_PICK' },
        3: { rating: 4.7, reviews: 14, oldPrice: 50, badgeType: 'NONE' },
        4: { rating: 4.8, reviews: 9, oldPrice: 125, badgeType: 'NONE' },
        5: { rating: 4.6, reviews: 32, oldPrice: 65, badgeType: 'TRENDING' },
        6: { rating: 4.8, reviews: 21, oldPrice: 80, badgeType: 'NONE' },
        7: { rating: 4.9, reviews: 5, oldPrice: 155, badgeType: 'TOP_RATED' },
        8: { rating: 4.7, reviews: 54, oldPrice: 36, badgeType: 'BESTSELLER' },
        9: { rating: "5.0", reviews: 3, oldPrice: 302, badgeType: 'ELITE_PICK' }
    },

    init() {
        this.grid = utils.getElement('courseGrid');
        this.searchInput = utils.getElement('courseSearch');
        this.filterBtns = utils.queryAll('.filter-btn');

        if (!this.grid) return;

        this.render(this.courses);
        this.setupFilters();
        this.setupSearch();
    },

    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterCourses();
            });
        });
    },

    setupSearch() {
        if (!this.searchInput) return;
        this.searchInput.addEventListener('input', utils.debounce(() => {
            this.filterCourses();
        }, 300));
    },

    filterCourses() {
        const activeBtn = utils.query('.filter-btn.active');
        const category = activeBtn?.getAttribute('data-filter') || 'all';
        const term = this.searchInput?.value.toLowerCase() || '';

        const filtered = this.courses.filter(course => {
            const matchesCategory = category === 'all' || course.category === category;
            const matchesSearch = course.title.toLowerCase().includes(term);
            return matchesCategory && matchesSearch;
        });

        this.render(filtered);
    },

    render(data) {
        if (!this.grid) return;
        this.grid.innerHTML = '';

        const currentDate = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

        data.forEach((course, index) => {
            const stats = this.stats[course.id] || { rating: 4.5, reviews: 5, oldPrice: 100, badgeType: 'NONE' };
            const currentVal = parseInt(course.price.replace('$', ''));
            const discountPercent = Math.round(((stats.oldPrice - currentVal) / stats.oldPrice) * 100);

            const card = document.createElement('div');
            card.className = 'course-card';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    ${this.getBadgeHTML(stats.badgeType)}
                    <img src="${course.image}" alt="${course.title}" class="card-image" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title" style="margin-bottom:5px; font-size: 1.25rem;">${course.title}</h3>
                    
                    <div style="font-size: 0.8rem; color: #FBBF24; margin-bottom: 12px; display: flex; align-items: center; gap: 5px;">
                        <div style="display:flex; gap:1px;">${this.getStarsHTML(stats.rating)}</div>
                        <span style="color: var(--text-muted); font-weight: 500; margin-left: 4px;">${stats.rating} (${stats.reviews} Ratings)</span>
                    </div>

                    <div style="font-size: 0.75rem; color: #10B981; margin-bottom: 10px; font-weight:700; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-rotate" style="font-size: 0.8em;"></i> Updated for ${currentDate}
                    </div>

                    <p class="card-desc">${course.desc}</p>
                    
                    <div class="card-footer">
                        <div class="price-box">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <span class="old-price">$${stats.oldPrice}</span>
                                <span style="background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.25); font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 6px;">-${discountPercent}%</span>
                            </div>
                            <span class="card-price">${course.price}</span>
                            <div style="font-size: 0.65rem; color: #9CA3AF; margin-top: 4px; display:flex; align-items:center; gap:4px;">
                                <i class="fa-solid fa-shield-halved"></i> 30-Day Guarantee
                            </div>
                        </div>
                        
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:5px;">
                            <a href="${course.url}" class="btn-card">Get Access</a>
                            <span style="font-size: 0.65rem; color: #A78BFA; font-weight:600;">
                                <i class="fa-solid fa-bolt"></i> Instant Access
                            </span>
                        </div>
                    </div>
                </div>
            `;

            this.grid.appendChild(card);
        });
    },

    getBadgeHTML(type) {
        const badges = {
            'USER_FAV': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 50%, #d1d5db 100%); color: #111827;"><i class="fa-solid fa-gem" style="margin-right: 4px;"></i> LIMITED DROP</div>',
            'BESTSELLER': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); text-shadow: 0 1px 2px rgba(0,0,0,0.3);"><i class="fa-solid fa-crown"></i> Bestseller</div>',
            'ELITE_PICK': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #8B5CF6, #D946EF);"><i class="fa-solid fa-crown"></i> Elite Pick</div>',
            'TRENDING': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #10B981, #059669);"><i class="fa-solid fa-arrow-trend-up"></i> Trending</div>',
            'TOP_RATED': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #6366f1, #4f46e5);"><i class="fa-solid fa-star"></i> Top Rated</div>'
        };
        return badges[type] || '';
    },

    getStarsHTML(rating) {
        if (rating >= 4.8) {
            return '<i class="fa-solid fa-star"></i>'.repeat(5);
        } else if (rating >= 4.3) {
            return '<i class="fa-solid fa-star"></i>'.repeat(4) + '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            return '<i class="fa-solid fa-star"></i>'.repeat(4) + '<i class="fa-regular fa-star"></i>';
        }
    }
};

// ========== 9. PROOF PULSE MODULE ==========
const ProofPulse = {
    productActions: [
        { title: "E-Commerce Mastery", color: "#84CC16" },
        { title: "Agency Architect", color: "#3B82F6" },
        { title: "Copywriter Secrets", color: "#10B981" },
        { title: "Market Strategy", color: "#00FF9D" },
        { title: "Faceless Influencer", color: "#FF0000" },
        { title: "Prime Dropshipping", color: "#FF9900" },
        { title: "Deal Closing Expert", color: "#22D3EE" },
        { title: "Insta Money", color: "#D946EF" },
        { title: "The Founder Playbook", color: "#FACC15" }
    ],

    database: {
        anglo: { weight: 0.40, countries: ["United States", "United Kingdom", "Canada", "Australia", "New Zealand"], names: ["James", "Michael", "Robert", "John", "David", "Sarah", "Jessica"] },
        dach: { weight: 0.20, countries: ["Germany", "Austria", "Switzerland", "Netherlands"], names: ["Maximilian", "Alexander", "Paul", "Sophie", "Hannah"] },
        latin: { weight: 0.15, countries: ["France", "Italy", "Spain", "Portugal"], names: ["Gabriel", "Léo", "Sofia", "Giulia"] },
        nordic: { weight: 0.10, countries: ["Sweden", "Norway", "Denmark"], names: ["William", "Liam", "Alice"] },
        central: { weight: 0.10, countries: ["Poland", "Czech Republic"], names: ["Jakub", "Antoni", "Julia"] },
        global: { weight: 0.05, countries: ["Singapore", "Japan", "UAE"], names: ["Wei", "Hiroshi", "Ahmed"] }
    },

    init() {
        this.pulse = utils.getElement('proof-pulse');
        this.img = utils.getElement('proof-img');
        this.name = utils.getElement('proof-name');
        this.loc = utils.getElement('proof-loc');
        this.info = utils.query('.proof-info');

        if (this.pulse && this.img && this.name && this.loc && this.info) {
            setTimeout(() => this.show(), 4500);
        }
    },

    getWeightedRegion() {
        const rand = Math.random();
        let sum = 0;
        for (const key in this.database) {
            sum += this.database[key].weight;
            if (rand <= sum) return this.database[key];
        }
        return this.database.anglo;
    },

    getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    show() {
        try {
            const region = this.getWeightedRegion();
            const country = this.getRandomItem(region.countries);
            const firstName = this.getRandomItem(region.names);
            const lastInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const fullName = `${firstName} ${lastInitial}.`;
            const product = this.getRandomItem(this.productActions);
            const timeAgo = Math.random() > 0.8 ? "Just now" : Math.floor(Math.random() * 59) + 1 + "m ago";

            this.img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${lastInitial}&background=random&color=fff&rounded=true&size=128&bold=true&format=svg`;
            this.name.textContent = fullName;
            this.loc.textContent = country;

            const actionLine = this.info.querySelector('div:last-child');
            if (actionLine) {
                actionLine.innerHTML = `
                    <span style="color: #9CA3AF;">Purchased</span>
                    <span style="color:${product.color}; font-weight:700;">${product.title}</span> 
                    <span style="opacity:0.5; font-size: 0.75rem; margin-left: 6px;">
                        <i class="fa-regular fa-clock" style="font-size:0.7rem; margin-right:3px;"></i> ${timeAgo}
                    </span>
                `;
            }

            this.pulse.classList.add('visible');
            setTimeout(() => {
                this.pulse.classList.remove('visible');
                const nextInterval = Math.random() * 16000 + 8000;
                setTimeout(() => this.show(), nextInterval);
            }, 6000);
        } catch (error) {
            console.error('ProofPulse error:', error);
        }
    }
};

// ========== 10. CONSTELLATION ANIMATION ==========
const Constellation = {
    init() {
        const canvas = utils.getElement('constellation-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height, particles = [];
        const particleCount = window.innerWidth < 768 ? 20 : 45;
        const connectionDistance = 150;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', utils.debounce(resize, 200));
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
                ctx.fillStyle = getComputedStyle(document.documentElement)
                    .getPropertyValue('--particle-color').trim();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(124, 58, 237, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        animate();
    }
};

window.addEventListener('DOMContentLoaded', () => Constellation.init());

// ========== 11. ROI CALCULATOR MODULE ==========
const ROICalculator = {
    init() {
        this.hoursSlider = utils.getElement('hours-slider');
        this.rateSlider = utils.getElement('rate-slider');

        if (!this.hoursSlider || !this.rateSlider) return;

        const update = () => {
            const hours = parseInt(this.hoursSlider.value) || 0;
            const rate = parseInt(this.rateSlider.value) || 0;

            const hoursDisplay = utils.getElement('hours-display');
            const rateDisplay = utils.getElement('rate-display');
            const resultDisplay = utils.getElement('result-display');

            if (hoursDisplay) hoursDisplay.textContent = hours;
            if (rateDisplay) rateDisplay.textContent = `$${rate}`;
            if (resultDisplay) {
                resultDisplay.textContent = `$${(hours * rate * 12).toLocaleString()}`;
            }
        };

        this.hoursSlider.addEventListener('input', update);
        this.rateSlider.addEventListener('input', update);
        update();
    }
};

// ========== 12. FAQ MODULE ==========
const FAQ = {
    init() {
        const questions = utils.queryAll('.faq-question');

        questions.forEach(question => {
            question.addEventListener('click', function () {
                // Close others
                questions.forEach(q => {
                    if (q !== this) {
                        q.classList.remove('active');
                        const panel = q.nextElementSibling;
                        if (panel) panel.style.maxHeight = null;
                    }
                });

                // Toggle current
                this.classList.toggle('active');
                const panel = this.nextElementSibling;
                if (panel) {
                    panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + 'px';
                }
            });
        });
    }
};

// ========== 13. COUNTDOWN TIMER ==========
const Countdown = {
    init() {
        const display = utils.getElement('countdown');
        if (!display) return;

        const update = () => {
            try {
                const now = new Date();
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const diff = Math.max(0, endOfDay - now);

                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            } catch (error) {
                console.error('Countdown error:', error);
            }
        };

        setInterval(update, 1000);
        update();
    }
};

window.addEventListener('DOMContentLoaded', () => Countdown.init());

// ========== 14. SCROLL REVEAL ==========
const ScrollReveal = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        utils.queryAll('.reveal').forEach(el => observer.observe(el));

        // Bento card mouse effect
        utils.queryAll('.bento-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }, { passive: true });
        });
    }
};

window.addEventListener('DOMContentLoaded', () => ScrollReveal.init());

// ========== 15. MODAL MODULE ==========
const Modals = {
    init() {
        // Login/Signup modals
        window.openLoginModal = () => this.open('login-modal');
        window.closeLoginModal = () => this.close('login-modal');
        window.closeSignupModal = () => this.close('signup-modal');

        window.switchToSignup = () => {
            this.close('login-modal');
            this.open('signup-modal');
        };

        window.switchToLogin = () => {
            this.close('signup-modal');
            this.open('login-modal');
        };

        // Generic modals
        const modalIds = ['privacy-modal', 'terms-modal', 'about-modal', 'story-modal', 'roadmap-modal'];

        modalIds.forEach(id => {
            // Ta linia usuwa "-modal" PRZED zmianą na wielkie litery, co naprawia błąd
            const cleanName = id.replace('-modal', '');
            const camelCase = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            
            window[`open${camelCase}Modal`] = () => this.open(id);
            window[`close${camelCase}Modal`] = () => this.close(id);
        });

        // Close on overlay click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close(e.target.id);
            }
        });
    },

    open(id) {
        const modal = utils.getElement(id);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    close(id) {
        const modal = utils.getElement(id);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
};

// ========== 16. DASHBOARD ANIMATION MODULE ==========
const Dashboard = {
    init() {
        const target = utils.query('.hero-dashboard');
        if (!target) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.animate();
                observer.unobserve(target);
            }
        }, { threshold: 0.3 });

        observer.observe(target);
    },

    animate() {
        const stats = [
            { id: 'dash-revenue', barId: 'bar-revenue', end: 9349, max: 10000 },
            { id: 'dash-bots', barId: 'bar-bots', end: 72, max: 100 },
            { id: 'dash-hours', barId: 'bar-hours', end: 144, max: 150 }
        ];

        stats.forEach(stat => {
            const numberEl = utils.getElement(stat.id);
            const barEl = utils.getElement(stat.barId);
            if (!numberEl || !barEl) return;

            let startTime = null;
            const duration = 2000;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const currentVal = Math.floor(progress * stat.end);

                numberEl.textContent = currentVal;
                barEl.style.width = `${(stat.end / stat.max) * progress * 100}%`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    numberEl.textContent = stat.end;
                    barEl.style.width = `${(stat.end / stat.max * 100)}%`;
                }
            };

            requestAnimationFrame(step);
        });

        // Log animation
        this.animateLog();
    },

    animateLog() {
        const logContainer = utils.getElement('dash-log-lines');
        if (!logContainer) return;

        logContainer.innerHTML = '';
        const logLines = [
            "System initialized...",
            "Deployment successful.",
            "72 Active automations verified.",
            "Syncing Shopify API...",
            "144 Hours recovered this month."
        ];

        let lineIdx = 0;
        const addLog = () => {
            if (lineIdx < logLines.length) {
                const div = document.createElement('div');
                div.className = 'log-line';
                div.textContent = "> " + logLines[lineIdx];
                logContainer.appendChild(div);
                lineIdx++;
                setTimeout(addLog, 800);
            }
        };

        setTimeout(addLog, 500);
    }
};

// ========== 17. PROMO TEXT MODULE ==========
const PromoText = {
    init() {
        const promoEl = utils.getElement('promo-text');
        if (!promoEl) return;

        const month = new Date().getMonth();
        const year = new Date().getFullYear();

        const promos = [
            `🔥 NEW YEAR PROMO ${year}: 30% OFF – Ends at 11:59 Tonight! 💸`,
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

        promoEl.textContent = promos[month];
    }
};

// ========== 18. MEGA MENU MODULE ==========
const MegaMenu = {
    init() {
        this.menu = utils.getElement('academy-mega-menu');
        this.trigger = utils.getElement('academy-trigger');
        this.closeBtn = utils.getElement('mega-close-btn');
        this.overlay = utils.getElement('mega-overlay');
        this.grid = utils.getElement('mega-grid-target');

        if (!this.menu || !this.trigger) return;

        this.setupCourses();
        this.setupEvents();
    },

    setupCourses() {
        if (!this.grid) return;

        const courses = [
            { title: "Ecom", img: "images/image1.png" },
            { title: "Agency", img: "images/image2.png" },
            { title: "Dropship", img: "images/image6.png" },
            { title: "Closing", img: "images/image7.png" },
            { title: "Founder", img: "images/image9.png" },
            { title: "YouTube", img: "images/image5.png" },
            { title: "Trading", img: "images/image4.png" },
            { title: "Copy", img: "images/image3.png" },
            { title: "Social", img: "images/image8.png" }
        ];

        this.grid.innerHTML = courses.map(c => `
            <div class="mega-item" onclick="window.scrollToLibrary()">
                <div class="mega-img-wrap"><img src="${c.img}" alt="${c.title}" loading="lazy"></div>
                <span>${c.title}</span>
            </div>
        `).join('');
    },

    setupEvents() {
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        this.closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        this.overlay?.addEventListener('click', () => this.close());

        document.addEventListener('click', (e) => {
            if (this.menu && !this.menu.contains(e.target) && e.target !== this.trigger && !this.trigger.contains(e.target)) {
                this.close();
            }
        });

window.scrollToLibrary = () => {
            // 1. Zamknij okienko Academy
            this.close();

            // 2. NOWOŚĆ: Zamknij też menu hamburgerowe (Solutions/Academy...)
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            if (mobileBtn) mobileBtn.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');

            // 3. Odblokuj przewijanie strony
            document.body.style.overflow = '';

            // 4. Przewiń do sekcji Library
            const lib = utils.getElement('library');
            lib?.scrollIntoView({ behavior: 'smooth' });
        };
    },

    toggle() {
        if (this.menu.classList.contains('show')) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        // PRZYWRÓCONO ORYGINAŁ: Używamy 'block', żeby nie psuć układu ramki
        this.menu.style.display = 'block'; 
        
        this.overlay?.classList.add('show');
        // Małe opóźnienie dla animacji CSS
        setTimeout(() => this.menu.classList.add('show'), 10);
        this.trigger.classList.add('active');
    },

    close() {
        this.menu.classList.remove('show');
        this.overlay?.classList.remove('show');
        this.trigger.classList.remove('active');
        // Czekamy aż animacja zanikania się skończy (400ms)
        setTimeout(() => {
            if (!this.menu.classList.contains('show')) {
                this.menu.style.display = 'none';
            }
        }, 400);
    }
};

// ========== 19. EMAIL PROTECTION MODULE ==========
const EmailProtection = {
    init() {
        const user = 'contact';
        const domain = 'pylonvision.com';

        // Footer email
        const link = utils.getElement('contact-link');
        const text = utils.getElement('contact-text');
        if (link && text) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `mailto:${user}@${domain}`;
            });
            text.textContent = `${user}@${domain}`;
        }

        // Modal email
        const modalLink = utils.getElement('modal-contact-link');
        const modalText = utils.getElement('modal-contact-text');
        if (modalLink && modalText) {
            modalText.textContent = `${user}@${domain}`;
            modalLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `mailto:${user}@${domain}`;
            });
        }

        // General email protectors
        utils.queryAll('.email-protector').forEach(link => {
            const u = link.getAttribute('data-user');
            const d = link.getAttribute('data-domain');
            if (u && d) {
                const email = `${u}@${d}`;
                link.setAttribute('href', `mailto:${email}`);
                const textSpan = link.querySelector('.email-text');
                if (textSpan) textSpan.textContent = email;
            }
        });

        // Protected email text
        utils.queryAll('.protected-email').forEach(el => {
            try {
                const email = el.textContent.replace(' [at] ', '@');
                if (email.includes('@')) {
                    el.innerHTML = `<a href="mailto:${email}" style="color: inherit; text-decoration: none;">${email}</a>`;
                }
            } catch (error) {
                console.error('Email protection error:', error);
            }
        });

        // Effective dates
        this.updateEffectiveDates();
    },

    updateEffectiveDates() {
        const dateElements = utils.queryAll('.effective-date');
        if (dateElements.length === 0) return;

        try {
            const now = new Date();
            const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
            const finalDate = new Date(now.getFullYear(), quarterMonth, 1);
            const formatted = finalDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            dateElements.forEach(el => {
                el.textContent = `Last Updated: ${formatted}`;
                el.style.color = '#10B981';
                el.style.fontWeight = '600';
            });
        } catch (error) {
            console.error('Date update error:', error);
        }
    }
};

// ========== END OF SCRIPT ==========
console.log('✅ Pylon Vision Enhanced Script Loaded Successfully');
