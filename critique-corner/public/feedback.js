// script.js

document.addEventListener("DOMContentLoaded", function() {
    const stars = document.querySelectorAll('.stars input[type="radio"]');

    stars.forEach(star => {
        star.addEventListener('change', function() {
            resetStarColors();
            highlightStars(this);
        });
    });

    function highlightStars(radio) {
        const selectedStar = radio.nextElementSibling;
        let current = selectedStar;
        while (current) {
            current.style.color = '#DC5F00';
            current = current.previousElementSibling;
        }
    }

    function resetStarColors() {
        const starLabels = document.querySelectorAll('.stars label');
        starLabels.forEach(label => {
            label.style.color = '#ccc';
        });
    }
});
