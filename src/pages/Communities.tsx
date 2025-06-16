import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FiEye, FiTrash2, FiStar } from "react-icons/fi";

// Mock data - replace with actual data from your API
const communities = [
  {
    id: 1,
    name: "Mindfulness & Meditation",
    createdBy: "John Doe",
    memberCount: 1250,
    topics: ["Meditation", "Mindfulness", "Wellness"],
    lastActive: "2024-03-20",
  },
  {
    id: 2,
    name: "Positive Psychology",
    createdBy: "Jane Smith",
    memberCount: 850,
    topics: ["Psychology", "Happiness", "Mental Health"],
    lastActive: "2024-03-19",
  },
  {
    id: 3,
    name: "Personal Growth",
    createdBy: "Mike Johnson",
    memberCount: 2100,
    topics: ["Self-improvement", "Motivation", "Success"],
    lastActive: "2024-03-18",
  },
];

const Communities = () => {
  const handleView = (id: number) => {
    console.log("View community:", id);
  };

  const handleRemove = (id: number) => {
    console.log("Remove community:", id);
  };

  const handleFeature = (id: number) => {
    console.log("Feature community:", id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-muted-foreground">
          Communities
        </h1>
        <Button className="bg-primary hover:bg-primary/90">
          Create Community
        </Button>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">
                Group Name
              </TableHead>
              <TableHead className="text-muted-foreground">
                Created By
              </TableHead>
              <TableHead className="text-muted-foreground">
                No. of Members
              </TableHead>
              <TableHead className="text-muted-foreground">
                Topics Covered
              </TableHead>
              <TableHead className="text-muted-foreground">
                Last Active
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communities.map((community) => (
              <TableRow key={community.id}>
                <TableCell className="font-medium text-foreground/80">
                  {community.name}
                </TableCell>
                <TableCell className="text-foreground/70">
                  {community.createdBy}
                </TableCell>
                <TableCell className="text-foreground/70">
                  {community.memberCount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {community.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary/80"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-foreground/70">
                  {community.lastActive}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(community.id)}
                      className="hover:bg-primary/10 hover:text-primary/80"
                    >
                      <FiEye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(community.id)}
                      className="hover:bg-destructive/10 hover:text-destructive/80"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFeature(community.id)}
                      className="hover:bg-primary/10 hover:text-primary/80"
                    >
                      <FiStar className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Communities;
