/* ==========================================
   CAMPUSCARE JAVASCRIPT
========================================== */


/* ==========================================
   DEMO DATA
========================================== */

let issues = [

    {
        id: "CC-100231",
        name: "Rahul",
        hostel: "Block A",
        category: "Mess",
        priority: "High",
        title: "Food quality needs improvement",
        description:
            "Food served during dinner was too oily and the quality has been inconsistent.",
        rating: 2,
        status: "Under Review",
        date: "10 Sep 2026"
    },

    {
        id: "CC-100232",
        name: "Priya",
        hostel: "Block B",
        category: "Cleanliness",
        priority: "Medium",
        title: "Washroom cleaning issue",
        description:
            "Common washrooms need more frequent cleaning, especially during evenings.",
        rating: 2,
        status: "Action Taken",
        date: "9 Sep 2026"
    },

    {
        id: "CC-100233",
        name: "Aman",
        hostel: "Block C",
        category: "Maintenance",
        priority: "High",
        title: "Broken ceiling fan",
        description:
            "The ceiling fan in room needs repair and has been making noise for several days.",
        rating: 2,
        status: "Submitted",
        date: "8 Sep 2026"
    },

    {
        id: "CC-100234",
        name: "Neha",
        hostel: "Block D",
        category: "Water",
        priority: "Critical",
        title: "Water supply interruption",
        description:
            "Water supply was unavailable for several hours in the morning.",
        rating: 1,
        status: "Resolved",
        date: "7 Sep 2026"
    }

];


/* ==========================================
   LOAD SAVED DATA
========================================== */

const savedIssues =
    JSON.parse(
        localStorage.getItem("campusIssues")
    );

if (savedIssues) {

    issues = savedIssues;

}


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayIssues();

        updateStats();

    }
);


/* ==========================================
   OPEN FEEDBACK
========================================== */

function openFeedback() {

    document
        .getElementById("feedback")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   SCROLL
========================================== */

function scrollToSection(id) {

    document
        .getElementById(id)
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   GENERATE TRACKING ID
========================================== */

function generateTrackingID() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return "CC-" + randomNumber;

}

// ============================================
// FEEDBACK FORM
// ============================================

const API_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {

    const feedbackForm = document.getElementById("feedbackForm");

    if (!feedbackForm) {
        console.error("Feedback form not found!");
        return;
    }

    feedbackForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        // Get form values
        const name = document.getElementById("studentName").value.trim();
        const hostel = document.getElementById("hostel").value;
        const category = document.getElementById("category").value;
        const priority = document.getElementById("priority").value;
        const title = document.getElementById("issueTitle").value.trim();
        const description = document.getElementById("issueDescription").value.trim();

        // Get rating
        const selectedRating = document.querySelector(
            'input[name="rating"]:checked'
        );

        const rating = selectedRating
            ? Number(selectedRating.value)
            : 5;

        // Basic validation
        if (!name || !hostel || !category || !title || !description) {
            alert("Please fill all required fields.");
            return;
        }

        try {

            // Send feedback to backend
            const response = await fetch(`${API_URL}/api/feedback`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    hostel: hostel,
                    category: category,
                    priority: priority,
                    title: title,
                    description: description,
                    rating: rating
                })
            });

            const data = await response.json();

            // Check backend response
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            console.log("Backend response:", data);

            // Add returned issue to the current page
            if (data.issue) {
                issues.unshift(data.issue);

                // Temporary local storage
                // We will replace this with MongoDB later.
                localStorage.setItem(
                    "campusIssues",
                    JSON.stringify(issues)
                );
            }

            // Show tracking ID
            const trackingIdElement =
                document.getElementById("trackingId");

            if (trackingIdElement) {
                trackingIdElement.textContent = data.trackingId;
            }

            // Open success modal
            const modal = document.getElementById("successModal");

            if (modal) {
                modal.classList.add("active");
            }

            // Reset form
            feedbackForm.reset();

            // Refresh issue list and statistics
            displayIssues();
            updateStats();

        } catch (error) {

            console.error("Error submitting feedback:", error);

            alert(
                "Unable to submit feedback.\n\n" +
                "Please make sure the CampusCare backend is running."
            );
        }

    });

});




/* ==========================================
   DISPLAY ISSUES
========================================== */

function displayIssues() {

    const container =
        document.getElementById(
            "issueContainer"
        );


    const search =
        document
            .getElementById(
                "searchIssue"
            )
            .value
            .toLowerCase();


    const category =
        document
            .getElementById(
                "filterCategory"
            )
            .value;


    const status =
        document
            .getElementById(
                "filterStatus"
            )
            .value;


    let filteredIssues =
        issues.filter(
            function (issue) {

                const matchesSearch =
                    issue.title
                        .toLowerCase()
                        .includes(search)
                    ||
                    issue.description
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "All"
                    ||
                    issue.category === category;


                const matchesStatus =
                    status === "All"
                    ||
                    issue.status === status;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus
                );

            }
        );


    container.innerHTML = "";


    if (
        filteredIssues.length === 0
    ) {

        container.innerHTML = `

            <div class="problem-card">

                <h3>
                    No issues found
                </h3>

                <p>
                    Try changing your filters.
                </p>

            </div>

        `;

        return;

    }


    filteredIssues.forEach(
        function (issue) {

            const statusClass =
                getStatusClass(
                    issue.status
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "issue-card";


            card.innerHTML = `

                <div>

                    <div class="issue-header">

                        <h3>
                            ${escapeHTML(issue.title)}
                        </h3>

                    </div>


                    <p>
                        ${escapeHTML(issue.description)}
                    </p>


                    <div class="issue-meta">

                        <span class="tag">
                            ${escapeHTML(issue.category)}
                        </span>

                        <span class="tag">
                            ${escapeHTML(issue.hostel)}
                        </span>

                        <span class="tag">
                            Priority: ${escapeHTML(issue.priority)}
                        </span>

                        <span class="tag">
                            ${escapeHTML(issue.id)}
                        </span>

                        <span class="tag">
                            ${escapeHTML(issue.date)}
                        </span>

                    </div>

                </div>


                <div>

                    <span class="status ${statusClass}">
                        ${escapeHTML(issue.status)}
                    </span>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   STATUS CLASS
========================================== */

function getStatusClass(status) {

    if (
        status === "Submitted"
    ) {

        return "submitted";

    }

    if (
        status === "Under Review"
    ) {

        return "review";

    }

    if (
        status === "Action Taken"
    ) {

        return "action";

    }

    if (
        status === "Resolved"
    ) {

        return "resolved";

    }

    return "";

}


/* ==========================================
   UPDATE STATS
========================================== */

function updateStats() {

    const total =
        issues.length;


    const resolved =
        issues.filter(
            issue =>
                issue.status === "Resolved"
        ).length;


    const pending =
        issues.filter(
            issue =>
                issue.status !== "Resolved"
        ).length;


    document
        .getElementById(
            "totalFeedback"
        )
        .innerText =
        total + 247;


    document
        .getElementById(
            "resolvedIssues"
        )
        .innerText =
        resolved + 204;


    document
        .getElementById(
            "pendingIssues"
        )
        .innerText =
        pending + 43;

}


/* ==========================================
   CLOSE MODAL
========================================== */

function closeModal() {

    document
        .getElementById(
            "successModal"
        )
        .classList
        .remove("show");


    document
        .getElementById("issues")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   ESCAPE HTML
   Security helper
========================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}