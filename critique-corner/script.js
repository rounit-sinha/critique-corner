document.addEventListener('DOMContentLoaded', function() {
    var typed = document.getElementById("typewriter");
    typed.innerHTML = "";
    var str = "Critique Corner!";
    var i = 0;
    var timer = setInterval(function() {
        if (i < str.length) {
            typed.innerHTML += str.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100); // Adjust speed (milliseconds)
});
