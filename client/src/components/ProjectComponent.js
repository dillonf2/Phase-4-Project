import React, { useState } from "react";

function ProjectComponent({ project, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const projectStyle = {
    border: '1px solid',
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: isHovered ? 'var(--selected-text)' : '',
    color: isHovered ? 'white' : '',
    transition: 'background-color 0.3s ease',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={projectStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h3 style={{ textDecoration: 'underline', fontSize: '20pt' }}>{project.name}</h3>
      <p>Token Count: {project.token_count}</p>
      <p>Review Count: {project.reviews.length}</p>
      {project.reviews.length > 0 && (
        <div>
          <p>Latest Reviews:</p>
          <ul style={{ listStyle: 'none' }}>
            {project.reviews.map((review) => (
              <li key={review.id}>"{review.review_text}" --Verified Member #{review.user_id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProjectComponent;