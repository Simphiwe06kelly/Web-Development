// ===== SEARCH & FILTER FOR SHOP PAGE =====
document.addEventListener('DOMContentLoaded', function() {
    initializeShopNavigation();
    initializeMobileNav();
    initializeGalleryLightbox();
});

function initializeShopNavigation() {
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const resultsInfo = document.getElementById('results-info');
    
    if (!searchInput) {
        console.log('Not on shop page');
        return;
    }

    const productCards = document.querySelectorAll('.product-card');
    let currentSearchTerm = '';
    let currentFilter = 'all';

    // ===== SEARCH FUNCTIONALITY =====
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        applyFilters();
    });

    // ===== FILTER BUTTON FUNCTIONALITY - FIXED VERSION =====
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            
            // Special case: Bestsellers redirects to home page
            if (currentFilter === 'bestseller') {
                window.location.href = 'index.html#bestsellers';
                return;
            }
            
            // Apply the filter
            applyFilters();
        });
    });

    // ===== MAIN FILTER FUNCTION - ACTUALLY HIDES/SHOWS PRODUCTS =====
    function applyFilters() {
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const productName = card.getAttribute('data-name').toLowerCase();
            
            let showProduct = true;
            
            // Apply category filter
            if (currentFilter !== 'all' && category !== currentFilter) {
                showProduct = false;
            }
            
            // Apply search filter
            if (currentSearchTerm && !productName.includes(currentSearchTerm)) {
                showProduct = false;
            }
            
            // Show or hide the product
            if (showProduct) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results info
        updateResultsInfo(visibleCount);
    }

    // ===== UPDATE RESULTS INFO =====
    function updateResultsInfo(visibleCount) {
        let filterText = 'All Products';
        if (currentFilter === 'homme') filterText = 'For Him';
        if (currentFilter === 'femme') filterText = 'For Her';
        
        let searchText = currentSearchTerm ? ` matching "${currentSearchTerm}"` : '';
        
        resultsInfo.textContent = `Showing ${visibleCount} of ${productCards.length} products in ${filterText}${searchText}`;
        
        // Show "no results" message if needed
        showNoResultsMessage(visibleCount);
    }

    // ===== NO RESULTS MESSAGE =====
    function showNoResultsMessage(visibleCount) {
        let noResultsMsg = document.getElementById('no-results-message');
        
        if (visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'no-results-message';
                noResultsMsg.className = 'no-results';
                noResultsMsg.innerHTML = `
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                `;
                const searchContainer = document.querySelector('.search-filter-container');
                searchContainer.parentNode.insertBefore(noResultsMsg, searchContainer.nextSibling);
            }
            noResultsMsg.style.display = 'block';
        } else {
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        }
    }

    // ===== SORT FUNCTIONALITY =====
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const hommeGrid = document.getElementById('homme-grid');
        const femmeGrid = document.getElementById('femme-grid');
        
        if (!hommeGrid || !femmeGrid) return;
        
        // Get visible products from each grid
        const hommeProducts = Array.from(hommeGrid.querySelectorAll('.product-card'));
        const femmeProducts = Array.from(femmeGrid.querySelectorAll('.product-card'));
        
        // Sort each collection
        sortProductArray(hommeProducts, sortValue);
        sortProductArray(femmeProducts, sortValue);
        
        // Clear and re-append
        hommeGrid.innerHTML = '';
        femmeGrid.innerHTML = '';
        
        hommeProducts.forEach(product => hommeGrid.appendChild(product));
        femmeProducts.forEach(product => femmeGrid.appendChild(product));
        
        // Update results info
        const visibleCount = Array.from(productCards).filter(card => card.style.display !== 'none').length;
        resultsInfo.textContent = `Products sorted by ${sortValue === 'default' ? 'default order' : sortValue.replace('-', ' ')}`;
    });
    
    function sortProductArray(products, sortValue) {
        products.sort((a, b) => {
            switch(sortValue) {
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'name':
                    return a.dataset.name.localeCompare(b.dataset.name);
                case 'default':
                default:
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            }
        });
    }

    // Initialize - show all products
    applyFilters();
    
    console.log('Shop navigation initialized successfully');
}

// ===== MOBILE NAVIGATION =====
function initializeMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ===== GALLERY LIGHTBOX =====
function initializeGalleryLightbox() {
    const productImages = document.querySelectorAll('.product-image img');
    
    if (productImages.length === 0) return;

    const lightboxHTML = `
        <div class="lightbox" id="gallery-lightbox">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-nav lightbox-prev">‹</button>
            <button class="lightbox-nav lightbox-next">›</button>
            <div class="lightbox-content">
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-info">
                    <div class="lightbox-title"></div>
                    <div class="lightbox-price"></div>
                </div>
                <div class="lightbox-counter"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxPrice = lightbox.querySelector('.lightbox-price');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let images = [];

    document.querySelectorAll('.product-card').forEach((card, index) => {
        const img = card.querySelector('img');
        const title = card.querySelector('.product-title')?.textContent || 'Product';
        const price = card.querySelector('.product-price')?.textContent || '';
        
        if (img) {
            images.push({
                src: img.src,
                alt: img.alt,
                title: title,
                price: price
            });
            
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                openLightbox(index);
            });
        }
    });

    function openLightbox(index) {
        currentImageIndex = index;
        const image = images[index];
        
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = image.title;
        lightboxPrice.textContent = image.price;
        lightboxCounter.textContent = `${index + 1} / ${images.length}`;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openLightbox(currentImageIndex);
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openLightbox(currentImageIndex);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}