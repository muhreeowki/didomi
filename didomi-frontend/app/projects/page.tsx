import React from "react";
import axios from "axios";

const ProjectsPage = async () => {
  const projects = await axios.get("http://localhost:3000/projects");

  return (
    <section>
      <div>
        {projects.data.map((item: any, i: number) => (
          <div>{item}</div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsPage;
