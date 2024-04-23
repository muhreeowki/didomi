import React from "react";
import axios from "axios";

const ProjectsPage = async () => {
  const projects = await axios
    .get("http://localhost:8000/projects")
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => console.error(err));

  return (
    <section>
      <div>
        {projects.map((item: any, i: number) => (
          <div key={i}>{item.title}</div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsPage;
