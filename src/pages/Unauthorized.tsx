import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Unauthorized Access
        </h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <Button
          onClick={() => navigate("/login")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
