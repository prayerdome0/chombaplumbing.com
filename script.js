// ============================================
// CHOMBA PLUMBING & LANDSCAPING - MAIN SCRIPT
// ============================================

import { 
    db,
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc,
    query, 
    orderBy, 
    serverTimestamp,
    onSnapshot
} from './firebase-config.js';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }

    // ===== SCROLL TO TOP =====
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    animateElements.forEach(el => observer.observe(el));

    // ============================================
    // LOAD DATA FROM FIREBASE
    // ============================================

    // --- Load Stats ---
    async function loadStats() {
        try {
            const statsRef = collection(db, 'settings');
            const querySnapshot = await getDocs(statsRef);
            let statsData = { projects: '500+', clients: '100+', years: '5+', support: '24/7' };
            querySnapshot.forEach((doc) => {
                if (doc.id === 'stats') {
                    statsData = doc.data();
                }
            });
            const sP = document.getElementById('statProjects');
            const sC = document.getElementById('statClients');
            const sY = document.getElementById('statYears');
            const sS = document.getElementById('statSupport');
            if (sP) sP.textContent = statsData.projects || '500+';
            if (sC) sC.textContent = statsData.clients || '100+';
            if (sY) sY.textContent = statsData.years || '5+';
            if (sS) sS.textContent = statsData.support || '24/7';
        } catch (e) {
            console.log('Using default stats');
        }
    }
    loadStats();

    // --- Load News ---
    function loadNews() {
        const newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) return;

        const q = query(collection(db, 'news'), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                newsGrid.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;padding:40px;color:#2f5547;">
                        <i class="fas fa-newspaper" style="font-size:3rem;color:#e67e22;"></i>
                        <p style="margin-top:12px;">No news yet. Check back soon!</p>
                    </div>
                `;
                return;
            }
            let html = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const imgSrc = data.image || '';
                html += `
                    <div class="news-card animate-on-scroll">
                        <div class="news-img">
                            ${imgSrc ? `<img src="${imgSrc}" alt="${data.title}" />` : `<div style="height:180px;background:#c1d9bb;display:flex;align-items:center;justify-content:center;color:#2f5547;"><i class="fas fa-image" style="font-size:2rem;"></i></div>`}
                        </div>
                        <div class="news-body">
                            <div class="date"><i class="far fa-calendar"></i> ${data.date || 'Recent'}</div>
                            <h4>${data.title || 'Update'}</h4>
                            <p>${data.content || ''}</p>
                        </div>
                    </div>
                `;
            });
            newsGrid.innerHTML = html;
            document.querySelectorAll('.news-card.animate-on-scroll').forEach(el => observer.observe(el));
        }, (error) => {
            console.error('Error loading news:', error);
        });
    }
    loadNews();

    // --- Load Gallery ---
    function loadGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        const q = query(collection(db, 'gallery'), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                galleryGrid.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;padding:40px;color:#2f5547;">
                        <i class="fas fa-images" style="font-size:3rem;color:#e67e22;"></i>
                        <p style="margin-top:12px;">No projects yet. Upload images via admin panel.</p>
                    </div>
                `;
                return;
            }
            let html = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const imgSrc = data.image || '';
                html += `
                    <div class="project-item animate-on-scroll">
                        <div class="project-img">${imgSrc ? `<img src="${imgSrc}" alt="${data.title}" />` : `<div style="height:180px;background:#c1d9bb;display:flex;align-items:center;justify-content:center;color:#2f5547;"><i class="fas fa-image" style="font-size:2rem;"></i></div>`}</div>
                        <div class="project-info">
                            <h4>${data.title || 'Project'}</h4>
                            <p>${data.category || 'General'}</p>
                            <span class="tag"><i class="fas fa-image"></i> ${data.category || 'General'}</span>
                        </div>
                    </div>
                `;
            });
            galleryGrid.innerHTML = html;
            document.querySelectorAll('.project-item.animate-on-scroll').forEach(el => observer.observe(el));
        }, (error) => {
            console.error('Error loading gallery:', error);
        });
    }
    loadGallery();

    // --- Load Testimonials ---
    function loadTestimonials() {
        const testimonialsGrid = document.getElementById('testimonialsGrid');
        if (!testimonialsGrid) return;

        const q = query(collection(db, 'testimonials'), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                const defaults = [
                    { name: 'Peter M.', comment: 'Chomba did an amazing job on our landscaping. Professional and on time!', rating: 5, location: 'Lusaka' },
                    { name: 'Grace C.', comment: 'They fixed our plumbing issues quickly and at a fair price. Highly recommend.', rating: 5, location: 'Kabulonga' },
                    { name: 'John B.', comment: 'The paver installation transformed our yard. Excellent workmanship!', rating: 5, location: 'Chalala' },
                ];
                let html = '';
                defaults.forEach((item) => {
                    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
                    html += `
                        <div class="testimonial-card animate-on-scroll">
                            <div class="stars">${stars}</div>
                            <p>"${item.comment}"</p>
                            <div class="client">
                                <div>
                                    <div class="name">${item.name}</div>
                                    <div class="role">${item.location}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                testimonialsGrid.innerHTML = html;
                document.querySelectorAll('.testimonial-card.animate-on-scroll').forEach(el => observer.observe(el));
                return;
            }
            let html = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const stars = '★'.repeat(data.rating || 5) + '☆'.repeat(5 - (data.rating || 5));
                html += `
                    <div class="testimonial-card animate-on-scroll">
                        <div class="stars">${stars}</div>
                        <p>"${data.comment || ''}"</p>
                        <div class="client">
                            <div>
                                <div class="name">${data.name || 'Anonymous'}</div>
                                <div class="role">${data.location || ''}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            testimonialsGrid.innerHTML = html;
            document.querySelectorAll('.testimonial-card.animate-on-scroll').forEach(el => observer.observe(el));
        }, (error) => {
            console.error('Error loading testimonials:', error);
        });
    }
    loadTestimonials();

    // --- Load Team ---
    function loadTeam() {
        const teamGrid = document.getElementById('teamGrid');
        if (!teamGrid) return;

        const q = query(collection(db, 'team'), orderBy('name'));
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                teamGrid.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;padding:40px;color:#2f5547;">
                        <i class="fas fa-users" style="font-size:3rem;color:#e67e22;"></i>
                        <p style="margin-top:12px;">No team members yet. Add them via admin panel.</p>
                    </div>
                `;
                return;
            }
            let html = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const imgSrc = data.image || '';
                html += `
                    <div class="team-member animate-on-scroll">
                        <div class="photo">${imgSrc ? `<img src="${imgSrc}" alt="${data.name}" />` : `<i class="fas fa-user-circle placeholder-icon" style="font-size:4.5rem;color:#1a4a2a;opacity:0.4;"></i>`}</div>
                        <div class="info">
                            <h4>${data.name || 'Team Member'}</h4>
                            <div class="role">${data.role || 'Professional'}</div>
                            <p>${data.bio || ''}</p>
                            ${data.facebook || data.instagram ? `
                            <div class="social-team">
                                ${data.facebook ? `<a href="${data.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>` : ''}
                                ${data.instagram ? `<a href="${data.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                            </div>` : ''}
                        </div>
                    </div>
                `;
            });
            teamGrid.innerHTML = html;
            document.querySelectorAll('.team-member.animate-on-scroll').forEach(el => observer.observe(el));
        }, (error) => {
            console.error('Error loading team:', error);
        });
    }
    loadTeam();

    // --- Load Full Testimonials (for testimonials.html) ---
    function loadFullTestimonials() {
        const container = document.getElementById('testimonialsFull');
        if (!container) return;

        const q = query(collection(db, 'testimonials'), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                const defaults = [
                    { name: 'Peter M.', comment: 'Chomba did an amazing job on our landscaping. Professional and on time!', rating: 5, location: 'Lusaka' },
                    { name: 'Grace C.', comment: 'They fixed our plumbing issues quickly and at a fair price. Highly recommend.', rating: 5, location: 'Kabulonga' },
                    { name: 'John B.', comment: 'The paver installation transformed our yard. Excellent workmanship!', rating: 5, location: 'Chalala' },
                    { name: 'Mary S.', comment: 'Very professional team. They completed the project on schedule and within budget.', rating: 5, location: 'Woodlands' },
                ];
                let html = '';
                defaults.forEach((item) => {
                    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
                    html += `
                        <div class="testimonial-full animate-on-scroll">
                            <div class="stars">${stars}</div>
                            <div class="quote">${item.comment}</div>
                            <div class="client-info">
                                <div>
                                    <div class="name">${item.name}</div>
                                    <div class="role">${item.location}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                container.innerHTML = html;
                document.querySelectorAll('.testimonial-full.animate-on-scroll').forEach(el => observer.observe(el));
                return;
            }
            let html = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const stars = '★'.repeat(data.rating || 5) + '☆'.repeat(5 - (data.rating || 5));
                html += `
                    <div class="testimonial-full animate-on-scroll">
                        <div class="stars">${stars}</div>
                        <div class="quote">${data.comment || ''}</div>
                        <div class="client-info">
                            <div>
                                <div class="name">${data.name || 'Anonymous'}</div>
                                <div class="role">${data.location || ''}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
            document.querySelectorAll('.testimonial-full.animate-on-scroll').forEach(el => observer.observe(el));
        });
    }
    loadFullTestimonials();

    // --- Gallery Filter (for gallery.html) ---
    function loadGalleryFilter() {
        const filterButtons = document.querySelectorAll('.gallery-filter button');
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid || !filterButtons.length) return;

        let allItems = [];

        function renderGallery(filter = 'all') {
            const filtered = filter === 'all' ? allItems : allItems.filter(item => item.category === filter);
            
            if (filtered.length === 0) {
                galleryGrid.innerHTML = `
                    <div class="gallery-empty">
                        <i class="fas fa-images"></i>
                        <p>No projects found in this category.</p>
                    </div>
                `;
                return;
            }

            let html = '';
            filtered.forEach((item) => {
                const imgSrc = item.image || '';
                html += `
                    <div class="project-item animate-on-scroll">
                        <div class="project-img">${imgSrc ? `<img src="${imgSrc}" alt="${item.title}" />` : `<div style="height:180px;background:#c1d9bb;display:flex;align-items:center;justify-content:center;color:#2f5547;"><i class="fas fa-image" style="font-size:2rem;"></i></div>`}</div>
                        <div class="project-info">
                            <h4>${item.title}</h4>
                            <p>${item.category}</p>
                            <span class="tag"><i class="fas fa-image"></i> ${item.category}</span>
                        </div>
                    </div>
                `;
            });
            galleryGrid.innerHTML = html;
            document.querySelectorAll('.project-item.animate-on-scroll').forEach(el => observer.observe(el));
        }

        const q = query(collection(db, 'gallery'), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => {
            allItems = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                allItems.push({
                    title: data.title || 'Project',
                    category: data.category || 'General',
                    image: data.image || ''
                });
            });

            const activeFilter = document.querySelector('.gallery-filter button.active')?.dataset.filter || 'all';
            renderGallery(activeFilter);
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderGallery(this.dataset.filter);
            });
        });
    }
    loadGalleryFilter();

    // ============================================
    // SUBMIT REVIEW (Testimonial)
    // ============================================
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        let selectedRating = 5;
        const ratingButtons = reviewForm.querySelectorAll('.rating-select button');
        ratingButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                ratingButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedRating = parseInt(this.dataset.rating);
            });
        });

        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = this.querySelector('#reviewName').value.trim();
            const location = this.querySelector('#reviewLocation').value.trim();
            const comment = this.querySelector('#reviewComment').value.trim();

            if (!name || !comment) {
                alert('Please fill in your name and comment.');
                return;
            }

            try {
                await addDoc(collection(db, 'testimonials'), {
                    name: name,
                    location: location || 'Zambia',
                    comment: comment,
                    rating: selectedRating,
                    timestamp: serverTimestamp()
                });
                alert('✅ Thank you for your review! It will appear shortly.');
                this.reset();
                ratingButtons.forEach(b => b.classList.remove('active'));
                document.querySelector('.rating-select button[data-rating="5"]').classList.add('active');
                selectedRating = 5;
            } catch (error) {
                console.error('Error submitting review:', error);
                alert('❌ Failed to submit review. Please try again.');
            }
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = this.querySelector('input[placeholder*="Name"]').value.trim();
            const email = this.querySelector('input[placeholder*="Email"]').value.trim();
            const phone = this.querySelector('input[placeholder*="Phone"]').value.trim();
            const subject = this.querySelector('input[placeholder*="Subject"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            try {
                await addDoc(collection(db, 'messages'), {
                    name: name,
                    email: email,
                    phone: phone || '',
                    subject: subject || 'General Inquiry',
                    message: message,
                    timestamp: serverTimestamp()
                });
                alert('✅ Message sent successfully! We will get back to you shortly.');
                this.reset();
            } catch (error) {
                console.error('Error sending message:', error);
                alert('❌ Failed to send message. Please try again.');
            }
        });
    }

    // ============================================
    // QUOTE FORM
    // ============================================
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = this.querySelector('input[placeholder*="Name"]').value.trim();
            const phone = this.querySelector('input[placeholder*="Phone"]').value.trim();
            const email = this.querySelector('input[placeholder*="Email"]').value.trim();
            const location = this.querySelector('input[placeholder*="Location"]').value.trim();
            const service = this.querySelector('select').value;
            const description = this.querySelector('textarea').value.trim();

            if (!name || !phone || !service || !description) {
                alert('Please fill in all required fields.');
                return;
            }

            try {
                await addDoc(collection(db, 'quotes'), {
                    name: name,
                    phone: phone,
                    email: email || '',
                    location: location || '',
                    service: service,
                    description: description,
                    timestamp: serverTimestamp()
                });
                alert('✅ Quote request sent successfully! We will contact you within 24 hours.');
                this.reset();
                const preview = document.getElementById('quoteFilePreview');
                if (preview) preview.innerHTML = '';
            } catch (error) {
                console.error('Error sending quote:', error);
                alert('❌ Failed to send quote request. Please try again.');
            }
        });
    }

    console.log('🚀 Chomba Plumbing website loaded successfully!');
    console.log('📁 Firebase connected and data syncing in real-time.');
});