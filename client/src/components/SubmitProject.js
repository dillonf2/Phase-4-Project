import React, { useState } from "react";

function SubmitProject({ user }) {
  const [name, setName] = useState("");
  const [tokenCount, setTokenCount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      name: name,
      token_count: tokenCount,
    };

    try {
      const response = await fetch("/submit_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        alert("Project submitted successfully!");
      } else {
        console.error("Project submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during project submission:", error);
    }
  };

  return (
    <div className="submit-project">
      <h1>Submit a New Project</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Token Count:
          <input
            type="number"
            value={tokenCount}
            onChange={(e) => setTokenCount(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Project</button>
      </form>
    </div>
  );
}

export default SubmitProject;