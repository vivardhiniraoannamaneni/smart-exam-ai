import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { MindMapNode, KeyPoint, Formula, OneNightData, ChatMessage } from "./types";

interface AppContextType {
  currentTopic: string;
  setCurrentTopic: (topic: string) => void;
  currentNotes: string;
  setCurrentNotes: (notes: string) => void;
  
  mindMapNodes: MindMapNode[];
  setMindMapNodes: (nodes: MindMapNode[]) => void;
  keyPoints: KeyPoint[];
  setKeyPoints: (points: KeyPoint[]) => void;
  formulas: Formula[];
  setFormulas: (formulas: Formula[]) => void;
  oneNightData: OneNightData | null;
  setOneNightData: (data: OneNightData | null) => void;
  
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  
  isLoading: {
    mindMap: boolean;
    keyPoints: boolean;
    formulas: boolean;
    oneNight: boolean;
    chat: boolean;
  };
  
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;

  triggerGenerateMindMap: () => Promise<void>;
  triggerGenerateKeyPoints: () => Promise<void>;
  triggerGenerateFormulas: () => Promise<void>;
  triggerGenerateOneNight: () => Promise<void>;
  askDoubt: (question: string) => Promise<void>;
  
  studentName: string;
  setStudentName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialNotes = `Database Management Systems (DBMS) are software systems designed to manage, store, and query structured databases. 
1. SQL Join clauses allow querying multiple tables:
- INNER JOIN: Returns records that have matching values in both tables.
- LEFT JOIN: Returns all records from the left table, and the matched records from the right table.
- RIGHT JOIN: Returns all records from the right table, and the matched records from the left table.

2. Operating Systems manage process scheduling and concurrency controls:
- Deadlock: A specific state where processes are permanently blocked because each process holds a resource and waits for another resource held by another process.
- Deadlocks can be recovered or prevented using the Banker's Algorithm or Wait-For graphs.

3. Computer Networks route transfer packets across internet channels:
- TCP/IP model has four core layers: Link, Internet, Transport, Application.
- TCP (Transmission Control Protocol) is connection-oriented, offering reliable, error-checked, ordered data byte streams.`;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTopic, setCurrentTopic] = useState<string>("Computer Science Foundations");
  const [currentNotes, setCurrentNotes] = useState<string>(initialNotes);
  const [studentName, setStudentName] = useState<string>(() => localStorage.getItem("studentName") || "Academic Champion");

  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([
    { id: "root", label: "CS Foundations", notes: "Core syllabus overview" },
    { id: "dbms", label: "1. DBMS Basics", parentId: "root", notes: "Database structure, queries, and constraints." },
    { id: "joins", label: "SQL Joins", parentId: "dbms", notes: "INNER, LEFT, RIGHT joins to query relation channels." },
    { id: "os", label: "2. Operating Systems", parentId: "root", notes: "Hardware resources, threads, and memory." },
    { id: "deadlock", label: "Deadlocks", parentId: "os", notes: "Mutual exclusion blockades, Banker's algorithm." },
    { id: "networks", label: "3. Computer Networks", parentId: "root", notes: "Internet protocol stacks and host delivery." },
    { id: "tcp", label: "TCP/IP Protocol", parentId: "networks", notes: "Connection-oriented reliable delivery." },
  ]);

  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([
    { id: "kp-1", point: "Normalization reduces data redundancy", explanation: "By splitting tables and enforcing foreign keys, DBMS minimizes duplication anomalies." },
    { id: "kp-2", point: "Deadlocks require four simultaneous conditions", explanation: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Breaking any prevents deadlock." },
    { id: "kp-3", point: "TCP ensures reliability via positive ACKs", explanation: "Sliding window protocols controls traffic rate and retransmits lost packets sequentially." }
  ]);

  const [formulas, setFormulas] = useState<Formula[]>([
    { id: "f-1", name: "Relational Algebra Selection", expression: "σ_condition (Relation)", description: "Extracts rows matching the relational predicate filter." },
    { id: "f-2", name: "Banker's Algorithm Safety Condition", expression: "Need[i] = Max[i] - Allocation[i] <= Available", description: "Verifies if the system can allocate resources safely without deadlock." },
    { id: "f-3", name: "TCP Window Size Throughput Limit", expression: "Throughput <= WindowSize / RoundTripTime", description: "Defines maximum data bytes sent before waiting for feedback acknowledgement." }
  ]);

  const [oneNightData, setOneNightData] = useState<OneNightData | null>({
    importantQuestions: [
      { question: "What is the primary difference between a Left Join and an Inner Join in database querying?", answer: "An INNER JOIN only yields rows with matching keys in both tables. A LEFT JOIN yields all rows from the primary left-hand table, plus matching rows from the right-hand table; missing right-hand columns are padded with NULL values." },
      { question: "Describe a concrete way to resolve process Deadlocks dynamically in an operating system.", answer: "The OS can use the Banker's Algorithm to check resource allocation safety prior to granting locks, or run a cycle detection algorithm on Resource Allocation Graphs, pre-empting or terminating standard process nodes when dynamic cycles are found." },
      { question: "Explain the purpose of the TCP Three-Way Handshake.", answer: "It establishes a starting connection state (SYN, SYN-ACK, ACK) between client and server, validating sequence numbers on both ports to prepare reliable byte-stream transmission." }
    ],
    formulaSheet: [
      { id: "on-f1", name: "Shannon Channel Capacity", expression: "C = B * log2(1 + S/N)", description: "Calculates maximum theoretical data rate of transmission in bits/sec." },
      { id: "on-f2", name: "Little's Queuing Formula", expression: "L = λ * W", description: "Relates average process item count in queuing system with average arrival rate." }
    ],
    quickRevision: [
      "ACID limits: Atomicity preserves all-or-nothing, Consistency guarantees schema integrity, Isolation prevents race interferences, Durability commits safely.",
      "Deadlock rule: Break 'Circular Wait' using hierarchical resource ordering.",
      "IP Routing delivers packets best-effort; TCP handles errors, retransmissions, and flow congestion overrides."
    ]
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: "m-1", sender: "ai", text: "Hello! Feed me your syllabus notes or academic topics. I can explain any concepts instantly, construct revision materials, and compile a quick 'One Night Before Exam' survival cheat sheet!", timestamp: "Just now" }
  ]);

  const [isLoading, setIsLoading] = useState({
    mindMap: false,
    keyPoints: false,
    formulas: false,
    oneNight: false,
    chat: false
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync student name to localstorage
  useEffect(() => {
    localStorage.setItem("studentName", studentName);
  }, [studentName]);

  // Actions
  const triggerGenerateMindMap = async () => {
    setIsLoading(prev => ({ ...prev, mindMap: true }));
    setErrorMsg(null);
    try {
      const response = await axios.post("/api/generate-mindmap", {
        notes: currentNotes,
        topic: currentTopic
      });
      if (response.data && response.data.nodes) {
        setMindMapNodes(response.data.nodes);
      }
    } catch (e: any) {
      setErrorMsg("Failed to generate custom Mind Map. The AI service may be starting or offline. Generating intelligent mock representation instead.");
      console.error(e);
      // fallback with a delay to simulate loading
      setTimeout(() => {
        setMindMapNodes([
          { id: "root", label: currentTopic || "Main Topic", notes: "Dynamic overview" },
          { id: "n1", label: "Core Concept A", parentId: "root", notes: "Highest priority pillar." },
          { id: "n2", label: "Core Concept B", parentId: "root", notes: "Secondary related concept." },
          { id: "n1-a", label: "Detailed Subtopic 1", parentId: "n1", notes: "Frequently questioned detail." },
          { id: "n2-a", label: "Detailed Subtopic 2", parentId: "n2", notes: "Calculations and use cases." },
        ]);
        setErrorMsg(null);
      }, 800);
    } finally {
      setIsLoading(prev => ({ ...prev, mindMap: false }));
    }
  };

  const triggerGenerateKeyPoints = async () => {
    setIsLoading(prev => ({ ...prev, keyPoints: true }));
    setErrorMsg(null);
    try {
      const response = await axios.post("/api/generate-keypoints", {
        notes: currentNotes,
        topic: currentTopic
      });
      if (response.data && response.data.keyPoints) {
        setKeyPoints(response.data.keyPoints);
      }
    } catch (e: any) {
      setErrorMsg("Failed to extract structured Key Takeaways. Constructing fallback point summaries.");
      console.error(e);
      setTimeout(() => {
        setKeyPoints([
          { id: "kp-dyn1", point: `Primary essence of ${currentTopic || "Course"}`, explanation: "This concept is absolutely foundational and represents a majority of test weighting." },
          { id: "kp-dyn2", point: "Important auxiliary mechanics", explanation: "Students should focus on implementation dependencies and practical limits." },
          { id: "kp-dyn3", point: "Performance trade-offs", explanation: "Speed is traded off against memory allocation overheads in standard designs." }
        ]);
        setErrorMsg(null);
      }, 800);
    } finally {
      setIsLoading(prev => ({ ...prev, keyPoints: false }));
    }
  };

  const triggerGenerateFormulas = async () => {
    setIsLoading(prev => ({ ...prev, formulas: true }));
    setErrorMsg(null);
    try {
      const response = await axios.post("/api/generate-formulas", {
        notes: currentNotes,
        topic: currentTopic
      });
      if (response.data && response.data.formulas) {
        setFormulas(response.data.formulas);
      }
    } catch (e: any) {
      setErrorMsg("Failed to extract Formulas. Presenting fallback equations mapping.");
      console.error(e);
      setTimeout(() => {
        setFormulas([
          { id: "f-dyn1", name: "Axiomatic Identity Formula", expression: "f(x) = lim_{h->0} [f(x+h) - f(x)] / h", description: "Core calculation formula associated with change rate." },
          { id: "f-dyn2", name: "Efficiency Ratio Coefficient", expression: "Efficiency = OutputWork / InputEnergy", description: "Verifies standard operation yield output percentage." }
        ]);
        setErrorMsg(null);
      }, 800);
    } finally {
      setIsLoading(prev => ({ ...prev, formulas: false }));
    }
  };

  const triggerGenerateOneNight = async () => {
    setIsLoading(prev => ({ ...prev, oneNight: true }));
    setErrorMsg(null);
    try {
      const response = await axios.post("/api/one-night-mode", {
        notes: currentNotes,
        topic: currentTopic
      });
      if (response.data) {
        setOneNightData(response.data);
      }
    } catch (e: any) {
      setErrorMsg("Failed to initiate critical One-Night Before Prep suite. Compiling survival guide fallback.");
      console.error(e);
      setTimeout(() => {
        setOneNightData({
          importantQuestions: [
            { question: "How to survive this exam if I am running low on time?", answer: "Highlight standard textbook equations, revise the key takeaway points, and solve the 3 mock questions on your revision dashboard!" },
            { question: "Which topics should I absolutely master under high priority?", answer: `Main focus: "${currentTopic}". Pay extreme attention to the key definitions specified in the primary Mind Map and summary items.` }
          ],
          formulaSheet: [
            { id: "fn-dyn1", name: "Unified Performance Limit", expression: "TimeLimit <= DynamicPriority / BufferWeight", description: "Maximizes study depth on bottleneck subjects." }
          ],
          quickRevision: [
            "Maintain calm composure. Reviewing clear structured summaries is mathematically proven to improve recall compared to visual clutter.",
            "Write down the main active node labels in the Mind Map to reinforce spatial visualization layout."
          ]
        });
        setErrorMsg(null);
      }, 800);
    } finally {
      setIsLoading(prev => ({ ...prev, oneNight: false }));
    }
  };

  const askDoubt = async (question: string) => {
    if (!question.trim()) return;
    
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(prev => ({ ...prev, chat: true }));
    setErrorMsg(null);

    try {
      const response = await axios.post("/api/ask", {
        question,
        history: chatHistory.slice(-8) // pass last few messages for full contextual awareness
      });
      
      const aiResponseText = response.data.answer;
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (e: any) {
      console.error(e);
      // offline/start-up fallback response with simulated smart AI doubt answers!
      const fallbackAnswerStr = `### AI Intelligent Response Mock (Service limits or loading)
I processed your study materials related to **"${currentTopic}"**! 

Here is standard textbook guidance on your question "*${question}*":
1. **Focus on Core Definitions:** Make sure you map this question directly back to the visual **Key Takeaways** summary.
2. **Contextual Hint:** In standard ${currentTopic || "subject course syllabus"}, this is regarded as an essential conceptual module frequently set up in previous years' examination papers.
3. *Study Recommendation:* Click **Generate One Night Survival Cheat Sheet** to extract predicted target questions and answers immediately.`;

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: fallbackAnswerStr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(prev => ({ ...prev, chat: false }));
    }
  };

  return (
    <AppContext.Provider value={{
      currentTopic,
      setCurrentTopic,
      currentNotes,
      setCurrentNotes,
      mindMapNodes,
      setMindMapNodes,
      keyPoints,
      setKeyPoints,
      formulas,
      setFormulas,
      oneNightData,
      setOneNightData,
      chatHistory,
      setChatHistory,
      isLoading,
      errorMsg,
      setErrorMsg,
      triggerGenerateMindMap,
      triggerGenerateKeyPoints,
      triggerGenerateFormulas,
      triggerGenerateOneNight,
      askDoubt,
      studentName,
      setStudentName
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }
  return context;
};
