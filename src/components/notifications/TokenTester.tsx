import { useState } from "react";
import NotificationService from "../../services/notification.service";
import api from "../../services/api.config";
import { Button } from "../ui/button";

export const TokenTester = () => {
  const [token, setToken] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const handleGetToken = async () => {
    try {
      setValidationResult("Deleting old token...");
      await NotificationService.deleteToken();
      setValidationResult("Getting new token...");
      const newToken = await NotificationService.requestPermission();
      if (newToken) {
        setToken(newToken);
        setValidationResult("New token obtained.");
      } else {
        setValidationResult("Failed to get new token.");
      }
    } catch (error) {
      console.error(error);
      setValidationResult(`Error getting token: ${(error as Error).message}`);
    }
  };

  const handleValidateToken = async () => {
    if (!token) {
      setValidationResult("No token to validate.");
      return;
    }
    try {
      setValidationResult("Validating token with backend...");
      const response = await api.post("/notifications/validate-token", {
        token,
      });
      setValidationResult(
        `Validation successful: ${JSON.stringify(response.data)}`
      );
    } catch (error: any) {
      console.error(error);
      setValidationResult(
        `Validation failed: ${JSON.stringify(error.response?.data)}`
      );
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-red-500 my-4">
      <h3 className="text-lg font-bold">FCM Token Debugger</h3>
      <div className="flex gap-4 my-2">
        <Button onClick={handleGetToken}>1. Get New Token</Button>
        <Button onClick={handleValidateToken} disabled={!token}>
          2. Validate Token
        </Button>
      </div>
      <p className="font-mono bg-gray-100 p-2 rounded break-all">
        <strong>Token:</strong> {token || "N/A"}
      </p>
      <p className="font-mono bg-gray-100 p-2 rounded mt-2">
        <strong>Status:</strong> {validationResult || "Idle"}
      </p>
    </div>
  );
};
