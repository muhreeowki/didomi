import axios from "axios";
import { Button } from "@/components/ui/button";
import { RedirectType, notFound, redirect } from "next/navigation";
import ProjectPage from "@/components/ProjectPage";

const Project = async ({ params }: any) => {
  const project: any = await axios
    .get(`http://localhost:8000/projects/${params.id}`)
    .then((data) => {
      return data.data;
    })
    .catch(console.error);

  const handleDelete = async () => {
    "use server";
    const { data } = await axios.delete(
      `http://localhost:8000/projects/${params.id}`
    );
    console.log(data.data);
    redirect("/dashboard", RedirectType.replace);
  };

  return project ? (
    <ProjectPage project={project} func={handleDelete} />
  ) : (
    notFound()
  );
};

export default Project;
