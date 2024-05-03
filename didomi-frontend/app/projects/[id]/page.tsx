import axios from "axios";
import { Button } from "@/components/ui/button";
import { RedirectType, notFound, redirect } from "next/navigation";
import ProjectDashboard from "@/components/ProjectDashboard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const Project = async ({ params }: any) => {
  const project: any = await axios
    .get(`http://localhost:8000/projects/${params.id}`)
    .then((data) => {
      return data.data;
    })
    .catch(console.error);

  const handleDelete = async (id: string) => {
    "use server";
    const { data } = await axios.delete(`http://localhost:8000/projects/${id}`);
    console.log(data.data);
    redirect("/dashboard", RedirectType.replace);
  };

  return project ? (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="top-0 hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current Project</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <ProjectDashboard project={project} deleteFunc={handleDelete} />
      </div>
    </div>
  ) : (
    notFound()
  );
};

export default Project;
