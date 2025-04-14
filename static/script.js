// Copy short URL to clipboard
document.querySelector('.actions button').addEventListener('click', function () {
    const shortUrl = document.querySelector('.short-url a').innerText;
    navigator.clipboard.writeText(shortUrl).then(function () {
        alert('URL copied to clipboard!');
    }).catch(function () {
        alert('Failed to copy URL.');
    });
});

	// back to top button
    window.addEventListener('scroll', function() {
        var backToTopButton = document.getElementById('back-to-top-btn');
        if (window.scrollY > 300) { // Adjust the scroll position to show the button
          backToTopButton.style.display = 'block';
        } else {
          backToTopButton.style.display = 'none';
        }
      });
      
        document.getElementById('back-to-top-btn').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
     
    