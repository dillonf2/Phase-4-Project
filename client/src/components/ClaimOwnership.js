import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";

function ClaimOwnership({ user }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [ownershipClaim, setOwnershipClaim] = useState({
    token_id: "", // Add more fields as needed
    // ...
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/projects");
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("An error occurred while fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  function handleProjectSelect(project) {
    setSelectedProject({
        id: project.id,
        name: project.name,
      });
    setOwnershipClaim({
      token_id: "",
    });
  }

  async function handleSubmitOwnershipClaim(event) {
    event.preventDefault();

    try {
      const response = await fetch("/claim_ownership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token_id: ownershipClaim.token_id,
          project_id: selectedProject.id,
          project_name: selectedProject.name,
        }),
      });

      if (response.ok) {
        alert("Ownership Claim Submitted Successfully!");
      } else {
        alert("Ownership Claim Submission Failed");
      }
    } catch (error) {
      console.error("An error occurred during ownership claim submission:", error);
    }
  }

  return (
    <div className="claim-ownership-div">
      <h1>Own an NFT From These Collections?</h1>
      <h2>Select the Project to Claim Ownership of your NFT!</h2>
      <h5>Don't see your project? Click on 'Submit a Project' at the top of the screen to add it!</h5>
      <div className="project-component-div">
        {projects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id}>
              <ProjectComponent project={project} onClick={() => handleProjectSelect(project)} />
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <div>
          <h3>Claim Ownership for {selectedProject.name}?</h3>
          <form onSubmit={handleSubmitOwnershipClaim}>
            <label>
              NFT Token ID:
              <input
                type="text"
                value={ownershipClaim.token_id}
                onChange={(e) => setOwnershipClaim({ ...ownershipClaim, token_id: e.target.value })}
              />
            </label>
            {/* Add other form fields as needed */}
            <button type="submit">Claim Ownership</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ClaimOwnership;