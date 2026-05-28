export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  parentId?: string;
  notes?: string;
}

export interface Formula {
  id: string;
  name: string;
  expression: string;
  description: string;
}

export interface KeyPoint {
  id: string;
  point: string;
  explanation: string;
}

export interface OneNightData {
  importantQuestions: { question: string; answer: string }[];
  formulaSheet: Formula[];
  quickRevision: string[];
}

export interface StudyNotes {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
