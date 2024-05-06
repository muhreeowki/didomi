import React from "react";
import axios from "axios";

const Project = async ({ params }: any) => {
  const project: any = await axios
    .get(`http://localhost:8000/projects/${params.id}`)
    .then((data) => {
      return data.data;
    })
    .catch(console.error);

  return (
    <section className="grid gap-4 grid-cols-12">
      <img className="col-span-5 w-full" src={project.imageURL} />
      <div></div>
    </section>
  );
};

export default Project;
