/**
 * Aurio Ghost Theme - Archive by Year
 * Groups posts by year from server-side data embedded in the page
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initArchive);
    } else {
        initArchive();
    }
    
    function initArchive() {
        const archiveDropdown = document.getElementById('archive-dropdown');
        if (!archiveDropdown) {
            console.warn('Archive dropdown not found');
            return;
        }
        
        // Get posts data from embedded JSON
        const dataScript = document.getElementById('archive-data');
        if (!dataScript) {
            console.warn('Archive data not found');
            return;
        }
        
        try {
            const posts = JSON.parse(dataScript.textContent);
            console.log(`Loaded ${posts.length} posts for archive`);
            const postsByYear = groupPostsByYear(posts);
            console.log('Posts grouped by year:', postsByYear);
            renderArchiveDropdown(archiveDropdown, postsByYear);
            
            // Check if there's a year filter in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const yearParam = urlParams.get('year');
            if (yearParam) {
                archiveDropdown.value = yearParam;
                filterPostsByYear(yearParam);
            }
        } catch (error) {
            console.error('Error parsing archive data:', error);
        }
    }
    
    /**
     * Group posts by year
     */
    function groupPostsByYear(posts) {
        const yearGroups = {};
        
        posts.forEach(post => {
            const date = new Date(post.published_at);
            const year = date.getFullYear();
            
            if (!isNaN(year)) {
                if (!yearGroups[year]) {
                    yearGroups[year] = 0;
                }
                yearGroups[year]++;
            }
        });
        
        // Convert to sorted array (newest first)
        return Object.keys(yearGroups)
            .map(year => ({
                year: parseInt(year),
                count: yearGroups[year]
            }))
            .sort((a, b) => b.year - a.year);
    }
    
    /**
     * Render the archive dropdown in the header
     */
    function renderArchiveDropdown(dropdown, postsByYear) {
        if (postsByYear.length === 0) {
            return;
        }
        
        // Add year options
        postsByYear.forEach(item => {
            const option = document.createElement('option');
            option.value = item.year;
            option.textContent = `${item.year} (${item.count})`;
            dropdown.appendChild(option);
        });
        
        // Add change handler for filtering
        dropdown.addEventListener('change', function() {
            const year = this.value;
            console.log('Archive dropdown changed:', year);
            
            // Check if we're on the home page (has post-card elements)
            const isHomePage = document.querySelector('.post-feed') !== null;
            
            if (isHomePage) {
                // Filter on current page
                filterPostsByYear(year);
            } else {
                // Navigate to home page with year filter
                const homeUrl = year === 'all' ? '/' : `/?year=${year}`;
                window.location.href = homeUrl;
            }
        });
    }
    
    /**
     * Filter posts on the page by year
     */
    function filterPostsByYear(year) {
        const posts = document.querySelectorAll('.post-card');
        let visibleCount = 0;
        
        posts.forEach(post => {
            const dateElement = post.querySelector('time[datetime]');
            if (!dateElement) {
                console.warn('No date element found in post', post);
                return;
            }
            
            const datetime = dateElement.getAttribute('datetime');
            if (!datetime) {
                console.warn('No datetime attribute found', dateElement);
                return;
            }
            
            const postDate = new Date(datetime);
            const postYear = postDate.getFullYear().toString();
            
            if (year === 'all' || postYear === year) {
                post.style.display = '';
                visibleCount++;
            } else {
                post.style.display = 'none';
            }
        });
        
        console.log(`Filtered to year ${year}, showing ${visibleCount} posts`);
        
        // Update URL without reload
        const url = year === 'all' ? window.location.pathname : `${window.location.pathname}?year=${year}`;
        window.history.pushState({year: year}, '', url);
    }
    
})();

/**
 * Search Functionality
 */
(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
    
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');
        if (!searchInput) return;
        
        let searchTimeout;
        
        // Handle search input
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim().toLowerCase();
            
            // Show/hide clear button
            if (searchClear) {
                searchClear.style.display = query ? 'block' : 'none';
            }
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Handle clear button
        if (searchClear) {
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                this.style.display = 'none';
                performSearch('');
                searchInput.focus();
            });
        }
        
        // Check URL for search parameter
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            searchInput.value = searchParam;
            if (searchClear) {
                searchClear.style.display = 'block';
            }
            performSearch(searchParam.toLowerCase());
        }
    }
    
    function performSearch(query) {
        const posts = document.querySelectorAll('.post-card');
        const postFeed = document.querySelector('.post-feed');
        
        if (!posts.length) return;
        
        if (!query) {
            // No search query - show all posts (respecting year filter)
            posts.forEach(post => {
                post.classList.remove('search-hidden');
                // Only show if not hidden by year filter
                if (post.style.display !== 'none') {
                    post.classList.remove('search-hidden');
                }
            });
            if (postFeed) postFeed.classList.remove('search-active');
            updateURL('');
            return;
        }
        
        if (postFeed) postFeed.classList.add('search-active');
        
        let visibleCount = 0;
        posts.forEach(post => {
            // Skip if hidden by year filter
            if (post.style.display === 'none') {
                return;
            }
            
            const title = post.querySelector('.post-card-title')?.textContent.toLowerCase() || '';
            const excerpt = post.querySelector('.post-card-excerpt')?.textContent.toLowerCase() || '';
            const tag = post.querySelector('.post-card-tag')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(query) || excerpt.includes(query) || tag.includes(query);
            
            if (matches) {
                post.classList.remove('search-hidden');
                visibleCount++;
            } else {
                post.classList.add('search-hidden');
            }
        });
        
        console.log(`Search for "${query}" found ${visibleCount} posts`);
        updateURL(query);
    }
    
    function updateURL(query) {
        const url = new URL(window.location);
        if (query) {
            url.searchParams.set('search', query);
        } else {
            url.searchParams.delete('search');
        }
        window.history.replaceState({}, '', url);
    }
    
})();
