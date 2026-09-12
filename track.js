function trackIssue() {

    const trackingId =
        document.getElementById("trackingInput").value.trim().toUpperCase();

    const result =
        document.getElementById("trackingResult");

    if (!trackingId) {
        result.innerHTML = `
            <div class="tracking-message">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>Please enter a tracking ID.</p>
            </div>
        `;
        return;
    }

    const issues =
        JSON.parse(localStorage.getItem("campusIssues")) || [];

    const issue =
        issues.find(item =>
            item.id.toUpperCase() === trackingId
        );

    if (!issue) {

        result.innerHTML = `
            <div class="tracking-message error">
                <i class="fa-solid fa-circle-xmark"></i>

                <h3>Issue Not Found</h3>

                <p>
                    We couldn't find an issue with tracking ID
                    <strong>${trackingId}</strong>.
                </p>
            </div>
        `;

        return;
    }

    const status = issue.status || "Submitted";

    let progressClass = "step-submitted";

    if (status === "In Progress") {
        progressClass = "step-progress";
    }

    if (status === "Resolved") {
        progressClass = "step-resolved";
    }

    result.innerHTML = `

        <div class="tracking-card">

            <div class="tracking-card-header">

                <div>
                    <span>Tracking ID</span>
                    <h2>${issue.id}</h2>
                </div>

                <span class="tracking-status ${progressClass}">
                    ${status}
                </span>

            </div>

            <div class="tracking-details">

                <h3>${issue.title}</h3>

                <p>${issue.description}</p>

                <div class="tracking-info">

                    <span>
                        <i class="fa-solid fa-building"></i>
                        ${issue.hostel}
                    </span>

                    <span>
                        <i class="fa-solid fa-tag"></i>
                        ${issue.category}
                    </span>

                </div>

            </div>

            <!-- Progress -->

            <div class="progress-container">

                <div class="progress-step active">

                    <div class="progress-circle">
                        <i class="fa-solid fa-paper-plane"></i>
                    </div>

                    <span>Submitted</span>

                </div>

                <div class="progress-line
                    ${status === "In Progress" || status === "Resolved"
                        ? "active-line" : ""}">
                </div>

                <div class="progress-step
                    ${status === "In Progress" || status === "Resolved"
                        ? "active" : ""}">

                    <div class="progress-circle">
                        <i class="fa-solid fa-spinner"></i>
                    </div>

                    <span>In Progress</span>

                </div>

                <div class="progress-line
                    ${status === "Resolved" ? "active-line" : ""}">
                </div>

                <div class="progress-step
                    ${status === "Resolved" ? "active" : ""}">

                    <div class="progress-circle">
                        <i class="fa-solid fa-check"></i>
                    </div>

                    <span>Resolved</span>

                </div>

            </div>

            <div class="tracking-footer">

                <strong>Current Status:</strong>

                <span>${status}</span>

            </div>

        </div>
    `;
}