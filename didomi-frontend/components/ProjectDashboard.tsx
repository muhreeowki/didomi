"use client";
import * as React from "react";
import ProjectAnalytics from "./ProjectAnalytics";
import ProjectEditPage from "./ProjectEdit";
import { Page } from "@/lib/enums";

const ProjectDashboard = (props: { project: any; deleteFunc: Function }) => {
  const [page, setPage] = React.useState<Page>(Page.ProjectAnalytics);

  return page == Page.ProjectEdit ? (
    <ProjectEditPage
      project={props.project}
      deleteFunc={props.deleteFunc}
      setPage={setPage}
    />
  ) : (
    <ProjectAnalytics
      project={props.project}
      deleteFunc={props.deleteFunc}
      setPage={setPage}
    />
  );
};

export default ProjectDashboard;
