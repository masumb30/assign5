
const filterButtons = document.querySelectorAll('.filter-btn');
const cardcontainer = document.getElementById('issue-container')
const allbutton = document.getElementById('all');
const openbutton = document.getElementById('open');
const closebutton = document.getElementById('close');
const searchinput = document.getElementById('searchinput');

filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        // 1. Remove active classes from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-white', 'text-gray-700');
        });

        // 2. Add active classes to the clicked button
        this.classList.remove('bg-white', 'text-gray-700');
        this.classList.add('bg-blue-600', 'text-white');
        displayData(this.id);
    });
});



const createCard = (issue, type) => {
    // 1. Mapping for Status Images
    const statusIcons = {
        "open": "/assets/Open-Status.png",
        "closed": "/assets/Closed-Status .png",// Assuming this exists
    };

    // 2. Mapping for Priority Colors
    const priorityStyles = {
        high: "bg-red-100 text-red-600",
        medium: "bg-yellow-100 text-yellow-600",
        low: "bg-blue-100 text-blue-600"
    };

    // 3. Mapping for Label Colors (using a default if label type is unknown)
    const labelStyles = {
        bug: "bg-red-100 text-red-600",
        enhancement: "bg-purple-100 text-purple-600",
        "help wanted": "bg-yellow-100 text-yellow-600"
    };
    const borderStyles = {
        open: 'border-t-[3px] border-t-green-400',
        closed: 'border-t-[3px] border-t-purple-400'
    }

    // 4. Formatting Date
    const formattedDate = new Date(issue.createdAt).toLocaleDateString();
    if (type === 'all' || type === issue.status) {
        return `
        <div onclick={handleModal(${issue.id})} class="card flex cursor-pointer hover:shadow-md flex-col bg-white rounded-t-md ${borderStyles[issue.status]}">
            <div class="p-2 border-b-2 border-b-gray-300 flex-grow">
                <div class="flex justify-between mt-2">
                    <img src="${statusIcons[issue.status]}" alt="${issue.status}" />
                    <div class="rounded-full px-5 uppercase font-bold text-xs flex items-center ${priorityStyles[issue.priority.toLowerCase()] || 'bg-gray-100 text-gray-600'}">
                        ${issue.priority}
                    </div>
                </div>
                
                <p class="font-bold text-md my-2">${issue.title}</p>
                
                <p class="font-extralight text-gray-700 line-clamp-2">
                    ${issue.description}
                </p>

                <div class="flex flex-wrap gap-2 my-2">
                    ${issue.labels.map(label => `
                        <div class="text-[12px] flex items-center rounded-full px-2 ${labelStyles[label.toLowerCase()] || 'bg-gray-100 text-gray-600'}">
                            <i class="fa fa-tag mr-1" aria-hidden="true"></i>
                            ${label}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="p-2">
                <p class="text-sm font-extralight text-gray-500 mb-2">#${issue.id} by ${issue.author}</p>
                <p class="text-sm font-extralight text-gray-500">${formattedDate}</p>
            </div>
        </div>
    `
    } else {
        return ``;
    }



};

const displayData = (type, url = '') => {
    // clear container
    cardcontainer.innerHTML = '';

    // set a spinner on container
    cardcontainer.innerHTML = `<div class="w-full h-[200px] flex items-center justify-center text-green-800">
    
    <span>Loading data...  </span><svg class="mr-3 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
</div>`

    const fetchurl = url === '' ? `https://phi-lab-server.vercel.app/api/v1/lab/issues` : `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${url}`;
    // load data
    fetch(fetchurl)
        .then(result => result.json())
        .then(data => {
            const issues = data.data;
            const count = issues.filter(issue => {
                if (type === 'all') {
                    return issue;
                } else {
                    return issue.status === type;
                }
            }).length;
            let content = `<div class="bg-white p-4 flex justify-between mt-4 shadow-sm rounded-md mb-4">
            <div class="flex items-center gap-2">
                <img class="bg-purple-100 p-3 rounded-full" src="assets/Aperture.png" alt="">
                <div>
                    <p class="font-bold text-lg">${count} Issues</p>
                    <p>Track and manage your project issues</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-[10px] h-[10px] rounded-full bg-green-500"></div>
                <p>Open</p>
                <div class="w-[10px] h-[10px] rounded-full bg-purple-500"></div>
                <p>Closed</p>
            </div>
        </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-gray-100 rounded-md p-4">`;
            issues.map(issue => {
                const card = createCard(issue, type);
                content += card;
            })
            content += `</div>`
            cardcontainer.innerHTML = ``;

            cardcontainer.innerHTML = content;
        })

    // remove spinner

    // display data

}

searchinput.addEventListener('keydown', function (event) {
    // Check if the pressed key is "Enter"
    if (event.key === 'Enter') {

        event.preventDefault();

        

        displayData('all', event.target.value);
        filterButtons.forEach(button => {
            console.log("consoling; ", button.id)
            if(button.id === 'all'){
                button.classList.remove('bg-white', 'text-gray-700');
                button.classList.add('bg-blue-600', 'text-white');
            }else{
                
                button.classList.remove('bg-blue-600', 'text-white');
                    button.classList.add('bg-white', 'text-gray-700');
            }
            
        });
    }
});

// const handleModal = (issueId)=> {
//     console.log(issueId)
//     // set a loading modal screen
//     const modal = 
//     document.body.appendChild();

//     // fetch data

//     // remove loading

//     // display modal with data
// }

displayData('all');


// modal functionality
async function handleModal(id) {
    const modal = document.getElementById('issueModal');
    const content = document.getElementById('modalContent');

    // 1. Show the modal and a loading state
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    content.innerHTML = `
        <div class="flex flex-col items-center justify-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-800"></div>
            <p class="mt-4 text-gray-600">Fetching issue details...</p>
        </div>
    `;

    try {
        // 2. Fetch the data
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        const issue = data.data;
        const statusStyle = {
            open: 'bg-green-700',
            closed: 'bg-purple-700'
        }
        const priorityStyles = {
            high: "bg-red-700",
            medium: "bg-yellow-500 ",
            low: "bg-blue-700"
        };
        const labelStyles = {
            bug: "bg-red-100 text-red-600",
            enhancement: "bg-purple-100 text-purple-600",
            "help wanted": "bg-yellow-100 text-yellow-600"
        };

        const assignee = issue.assignee === '' ? 'Not Assigned' : issue.assignee;

        // 3. Remove loading and fill with data
        content.innerHTML = `<p class="text-xl font-bold mb-2">${issue.title}</p>
            <div class="flex text-sm font-extralight items-center gap-2">
                <button class="${statusStyle[issue.status]} px-2 py-1 rounded-full text-white">${issue.status}</button>
                <div class="w-[4px] h-[4px] rounded-full bg-gray-500"></div>
                <p>Opened by Fahim Ahmed</p>
                <div class="w-[4px] h-[4px] rounded-full bg-gray-500"></div>
                <p>22/02/2026</p>
            </div>

            <div class="flex flex-wrap gap-2 my-2">
                    ${issue.labels.map(label => `
                        <div class="text-[12px] flex items-center rounded-full px-2 ${labelStyles[label.toLowerCase()] || 'bg-gray-100 text-gray-600'}">
                            <i class="fa fa-tag mr-1" aria-hidden="true"></i>
                            ${label}
                        </div>
                    `).join('')}
                </div>
            <p class="font-extralight">The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.</p>

            <div class="bg-gray-100 p-2 grid grid-cols-2">
                <div>
                    <p>Assigne:</p>
                    <p class="font-bold">${assignee}</p>
                </div>
                <div >
                    <p>Priority</p>
                    <button class="${priorityStyles[issue.priority]} px-4 py-1 rounded-full text-white">${issue.priority}</button>
                </div>
            </div>`;
    } catch (error) {
        // Handle Errors
        content.innerHTML = `
            <div class="text-center py-10">
                <p class="text-red-500 font-bold">Error: ${error.message}</p>
                <button onclick="closeModal()" class="mt-4 underline">Close</button>
            </div>
        `;
    }
}

function closeModal() {
    const modal = document.getElementById('issueModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

window.onclick = function (event) {
    const modal = document.getElementById('issueModal');
    if (event.target == modal) {
        closeModal();
    }
}