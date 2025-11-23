// src/context/AIContentContext.tsx
import React, { createContext, useContext, useState } from "react";
import { generateContent, GenerateContentPayload, GenerateContentResponse } from "../api/generateContent";

interface AIContentContextType {
  content: string;
  fetchContent: (payload: GenerateContentPayload) => Promise<void>;
}

const AIContentContext = createContext<AIContentContextType | undefined>(undefined);

export const AIContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState("");

  const fetchContent = async (payload: GenerateContentPayload) => {
    const response: GenerateContentResponse = await generateContent(payload);
    setContent(response.content);
  };

  return (
    <AIContentContext.Provider value={{ content, fetchContent }}>
      {children}
    </AIContentContext.Provider>
  );
};

export const useAIContent = () => {
  const context = useContext(AIContentContext);
  if (!context) throw new Error("useAIContent must be used within AIContentProvider");
  return context;
};
