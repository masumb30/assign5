
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 1. Remove active classes from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-white', 'text-gray-700');
        });

        // 2. Add active classes to the clicked button
        this.classList.remove('bg-white', 'text-gray-700');
        this.classList.add('bg-blue-600', 'text-white');
    });
});