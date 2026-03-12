document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const linkModal = document.getElementById('linkModal');
    const modalContent = document.getElementById('modalContent');

    const links = [
        { text: 'students Results', url: 'https://kanyadet-school-admin.web.app/Report-Cards/Results.html' },
        { text: 'students Results', url: 'https://kanyadet-school-admin.web.app/Report-Cards/All-Report-cards.html' },
        { text: 'Deleted Results', url: 'https://kanyadet-school-admin.web.app/Report-Cards/ResultsDeleted.html' },
        { text: '🧑‍⚕️Report Cards-Junior School ', url: 'https://kanyadet-school-admin.web.app/Report-Cards/Reports-Cards-Junior-School.html' },
        { text: '🧑‍⚕️Report Cards-Upper Primary ', url: 'https://kanyadet-school-admin.web.app/Report-Cards/Reports-Cards-Upper-Primary.html' },
        { text: '🧑‍⚕️Report Cards-Lower Primary ', url: 'https://kanyadet-school-admin.web.app/Report-Cards/Reports-Cards-lower-Primary.html' },
        { text: 'Active Students', url: 'https://kanyadet-school-admin.web.app/New-Students-Database/Active-Students-Database.html' },
        { text: 'Deleted Students', url: 'https://kanyadet-school-admin.web.app/New-Students-Database/All-Deleted-Students-Database.html' },
        { text: 'specific Missing Fields', url: 'https://kanyadet-school-admin.web.app/New-Students-Database/Missing-Fields/Specific-missing-fields/index.html' },
        { text: 'All Missing Fields', url: 'https://kanyadet-school-admin.web.app/New-Students-Database/Missing-Fields/All-missing-Fields/index.html' },
        { text: 'Birth Certificates', url: 'https://kanyadet-school-admin.web.app/Birth-Certificates/BirthSuperbase.html' },
        { text: 'Home', url: 'https://kanyadet-school-admin.web.app/index.html' }
    ];

    const buildModal = () => {
        modalContent.innerHTML = `
            <div class="flex justify-between items-center mb-6   ">
                <h2 class="text-xl md:text-2xl font-bold text-gray-800">External Resources</h2>
                <button id="closeModalBtn" class="text-gray-500 hover:text-gray-900 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>


            <div id="linksContainer" class="grid gap-4 grid-cols-1 md:grid-cols-2 h-[40vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500"></div>


            <div id="summarySection" class="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p class="font-semibold text-lg mb-2 text-gray-800">Summary ✨</p>
                <p class="text-gray-600 text-sm">Click a link to view its content and resources.</p>
            </div>
        `;

        // Populate links
        const linksContainer = modalContent.querySelector('#linksContainer');
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.textContent = link.text;
            a.className = 'p-4 rounded-lg shadow-md text-center bg-gray-100 hover:bg-gray-200 text-indigo-800 font-semibold';
            linksContainer.appendChild(a);
        });

        // Close button action
        modalContent.querySelector('#closeModalBtn').addEventListener('click', () => {
            linkModal.classList.add('hidden');
        });
    };

    toggleBtn.addEventListener('click', () => {
        buildModal();
        linkModal.classList.remove('hidden');
    });

    // Close modal on outside click
    linkModal.addEventListener('click', (event) => {
        if (!modalContent.contains(event.target)) {
            linkModal.classList.add('hidden');
        }
    });
});
