import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProjectThumbnail = (props: { item: any }) => {
  return (
    <Link
      href={`/dashboard/project/${props.item.id}`}
      key={props.item.id}
      className="w-full h-full max-w-xs lg:max-w-lg col-span-2 transition-all scale-80 lg:scale-100 lg:hover:scale-95"
    >
      <Card className="w-full h-full">
        <CardContent className="w-full h-full flex flex-col lg:flex-row gap-2 items-center justify-between p-0 ">
          <div className="relative w-full h-full aspect-square rounded-md items-center justify-center overflow-hidden">
            <Image
              src={
                props.item.imageURL ||
                "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              }
              alt={props.item.title}
              fill
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <Card className="border-none">
            <CardHeader className="p-4">
              <CardTitle className="capitalize">
                {props.item.title.length > 20
                  ? props.item.title.substring(0, 17) + "..."
                  : props.item.title}
              </CardTitle>
              <CardDescription>
                {props.item.story.substring(0, 87) + "..."}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-4 p-4 items-start justify-center">
              <Progress
                value={
                  (props.item.currentAmount / props.item.targetAmount) * 100
                }
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectThumbnail;
