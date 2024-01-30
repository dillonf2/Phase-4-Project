
import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://full-stack-project-rup2.onrender.com/projects");
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("An error occurred while fetching projects:", error);
      }
    };

    fetchData();
  }, []);

function handleClick(id){
    
}
  return (
    <div>
      <h2>Projects</h2>
      <div className="project-component-div">
        {projects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} onClick={(project_id)=> handleClick(project_id)}>
              <ProjectComponent project={project} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Projects;