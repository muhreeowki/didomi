"use client";
import React from "react";
import { Button } from "./ui/button";

const ProjectPage = (props: { project: any; func: Function }) => {
  return (
    <div className="text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        {props.project ? props.project.title : "An Error Occured"}
      </h1>
      <Button variant={"destructive"} onClick={() => props.func()}>
        Delete
      </Button>
    </div>
  );
};

export default ProjectPage;
