// ============================================
// CAMPUSCARE ADMIN DASHBOARD
// ============================================


// Get issues submitted from the student portal

let adminIssues =
    JSON.parse(localStorage.getItem("campusIssues")) || [];


// ============================================
// INITIAL LOAD
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    displayAdminIssues();

    updateAdminStats();

    setupAdminFilters();

});


// ============================================
// DISPLAY ISSUES
// ============================================

function displayAdminIssues() {

    const container =
        document.getElementById("adminIssueList");

    const search =
        document.getElementById("adminSearch").value
        .toLowerCase();

    const category =
        document.getElementById("adminCategory").value;

    const status =
        document.getElementById("adminStatus").value;


    const filteredIssues = adminIssues.filter(issue => {

        const matchesSearch =
            issue.title.toLowerCase().includes(search) ||
            issue.description.toLowerCase().includes(search) ||
            issue.name.toLowerCase().includes(search);


        const matchesCategory =
            category === "all" ||
            issue.category === category;


        const matchesStatus =
            status === "all" ||
            issue.status === status;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        );

    });


    document.getElementById("issueCount").textContent =
        `${filteredIssues.length} issues`;


    if (filteredIssues.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <i class="fas fa-inbox"></i>

                <h3>No issues found</h3>

                <p>
                    No feedback matches your current filters.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        filteredIssues
            .map(issue => createAdminIssueCard(issue))
            .join("");

}


// ============================================
// ISSUE CARD
// ============================================

function createAdminIssueCard(issue) {

    return `

        <div class="admin-issue-card">

            <div class="issue-top">

                <div>

                    <span class="tracking-id">
                        ${issue.id}
                    </span>

                    <h3>
                        ${escapeHTML(issue.title)}
                    </h3>

                </div>


                <span class="priority ${getPriorityClass(issue.priority)}">
                    ${issue.priority}
                </span>

            </div>


            <p class="issue-description">
                ${escapeHTML(issue.description)}
            </p>


            <div class="issue-details">

                <span>
                    <i class="fas fa-user"></i>
                    ${escapeHTML(issue.name)}
                </span>

                <span>
                    <i class="fas fa-building"></i>
                    ${escapeHTML(issue.hostel)}
                </span>

                <span>
                    <i class="fas fa-tag"></i>
                    ${escapeHTML(issue.category)}
                </span>

                <span>
                    <i class="fas fa-calendar"></i>
                    ${issue.date}
                </span>

            </div>


            <div class="admin-action-row">

                <div>

                    <span class="status-label">
                        Current Status:
                    </span>

                    <span class="status ${getStatusClass(issue.status)}">
                        ${issue.status}
                    </span>

                </div>


                <div class="admin-actions">

                    ${
                        issue.status !== "In Progress"
                        && issue.status !== "Resolved"
                        ?
                        `
                        <button
                            onclick="updateIssueStatus('${issue.id}', 'In Progress')"
                            class="action-btn progress-btn">

                            <i class="fas fa-spinner"></i>

                            In Progress

                        </button>
                        `
                        :
                        ""
                    }


                    ${
                        issue.status !== "Resolved"
                        ?
                        `
                        <button
                            onclick="updateIssueStatus('${issue.id}', 'Resolved')"
                            class="action-btn resolve-btn">

                            <i class="fas fa-check"></i>

                            Resolve

                        </button>
                        `
                        :
                        ""
                    }

                </div>

            </div>

        </div>

    `;
}


// ============================================
// UPDATE STATUS
// ============================================

function updateIssueStatus(id, newStatus) {

    const issue =
        adminIssues.find(item => item.id === id);


    if (!issue) {
        return;
    }


    issue.status = newStatus;


    // Save updated issue

    localStorage.setItem(
        "campusIssues",
        JSON.stringify(adminIssues)
    );


    // Refresh dashboard

    displayAdminIssues();

    updateAdminStats();


    console.log(
        `Issue ${id} updated to ${newStatus}`
    );

}


// ============================================
// STATISTICS
// ============================================

function updateAdminStats() {

    document.getElementById("adminTotal").textContent =
        adminIssues.length;


    document.getElementById("adminSubmitted").textContent =
        adminIssues.filter(
            issue => issue.status === "Submitted"
        ).length;


    document.getElementById("adminProgress").textContent =
        adminIssues.filter(
            issue => issue.status === "In Progress"
        ).length;


    document.getElementById("adminResolved").textContent =
        adminIssues.filter(
            issue => issue.status === "Resolved"
        ).length;

}


// ============================================
// FILTERS
// ============================================

function setupAdminFilters() {

    document
        .getElementById("adminSearch")
        .addEventListener(
            "input",
            displayAdminIssues
        );


    document
        .getElementById("adminCategory")
        .addEventListener(
            "change",
            displayAdminIssues
        );


    document
        .getElementById("adminStatus")
        .addEventListener(
            "change",
            displayAdminIssues
        );

}


// ============================================
// HELPERS
// ============================================

function getPriorityClass(priority) {

    if (priority === "High") {
        return "high";
    }

    if (priority === "Medium") {
        return "medium";
    }

    return "low";

}


function getStatusClass(status) {

    if (status === "Resolved") {
        return "resolved";
    }

    if (status === "In Progress") {
        return "in-progress";
    }

    return "submitted";

}


function escapeHTML(text) {

    if (!text) {
        return "";
    }

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}