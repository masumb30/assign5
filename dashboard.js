
const filterButtons = document.querySelectorAll('.filter-btn');
const cardcontainer = document.getElementById('issue-container')

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



const createCard = (issue) => {
    // 1. Mapping for Status Images
    const statusIcons = {
        "open": "/assets/Open-Status.png",
        "closed": "/assets/Closed-Status .png" ,// Assuming this exists
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

    return `
        <div class="card flex flex-col bg-white rounded-t-md ${borderStyles[issue.status]}">
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
    `;
};

const displayData = ()=> {
    // clear container
    cardcontainer.innerHTML = '';

    // set a spinner on container
    cardcontainer.innerHTML = `<div class="w-full h-[200px] flex items-center justify-center"> 
                Loading...
            </div>`

    // load data
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
.then(result=> result.json())
.then(data=> {
    const issues = data.data;
    let content = '';
    issues.map(issue=> {
        const card = createCard(issue);
        content+= card;
    })
    cardcontainer.innerHTML = ``;
    cardcontainer.innerHTML = content;
})

    // remove spinner

    // display data

}


displayData();