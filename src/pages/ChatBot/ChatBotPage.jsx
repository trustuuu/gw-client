import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // for code block styling

import { httpClient } from "../../api/httpClient";

/** ✅ Collapsible JSON Viewer */
function JSONViewer({ data }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((c) => !c);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 overflow-x-auto">
      <div className="flex items-center justify-between">
        <span className="font-semibold">JSON Data</span>
        <button
          onClick={toggle}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!collapsed && (
        <pre className="mt-2 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function MarkdownSafe({ content }) {
  if (!content || typeof content !== "string") {
    return <div className="text-gray-400">⚠️ No content to display</div>;
  }

  try {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  } catch (err) {
    console.error("[MarkdownSafe] render failed:", err);
    return (
      <div className="text-red-500 text-sm">
        ⚠️ Error rendering message: {err.message}
      </div>
    );
  }
}

/** ✅ Unified Chat Message Renderer */
function ChatMessage({ role, text, time }) {
  let content = null;

  // Auto-detect JSON
  try {
    const json = JSON.parse(text);
    if (typeof json === "object") {
      content = <JSONViewer data={json} />;
    }
  } catch {
    // not JSON — fallback to markdown
    content = <MarkdownSafe content={String(text ?? "")} />;
  }

  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 shadow ${
          role === "user"
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none"
        }`}
      >
        {content}
        <div className="text-xs text-gray-400 text-right mt-1">{time}</div>
      </div>
    </div>
  );
}

/** 💬 Main Chat Box */
export default function ChatBotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text, time: new Date().toLocaleTimeString() },
    ]);

    try {
      const url = `${import.meta.env.VITE_MCP_HTTP_URL}/chat`;
      const res = await httpClient.post(`${url}`, {
        message: text,
      });
      console.log("res.data", res.data);
      const reply = res?.data?.reply ?? "No response";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ Error: ${err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 text-center font-semibold">
        🤖 UniDir Agent Chat
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages ? (
          messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} text={m.text} time={m.time} />
          ))
        ) : (
          <></>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 py-2 rounded-xl font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
