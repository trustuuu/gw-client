import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { httpClient } from "../../api/httpClient";
import { visit } from "unist-util-visit";

export function JSONViewer({ data }) {
  const [collapsed, setCollapsed] = useState(
    JSON.stringify(data).length > 400 // auto-collapse large data
  );

  // simple color-highlighting function
  const syntaxHighlight = (json) => {
    if (!json) return "";
    json = JSON.stringify(json, null, 2);
    return json
      .replace(
        /(&|<|>)/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])
      )
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = "text-gray-200";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) cls = "text-blue-400"; // key
            else cls = "text-green-400"; // string
          } else if (/true|false/.test(match)) cls = "text-orange-400";
          else if (/null/.test(match)) cls = "text-pink-400";
          else cls = "text-amber-300"; // number
          return `<span class="${cls}">${match}</span>`;
        }
      );
  };

  return (
    <div className="rounded-xl bg-gray-900 text-gray-100 border border-gray-700 shadow-inner">
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700 bg-gray-800 rounded-t-xl">
        <span className="font-semibold text-sm">🧠 JSON Preview</span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-xs text-blue-400 hover:underline"
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>

      {!collapsed && (
        <pre
          className="text-sm px-4 py-3 font-mono overflow-x-auto whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}
        />
      )}
    </div>
  );
}

// Auto-detect raw URLs not formatted in Markdown
function rehypeLinkify() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || parent.tagName === "a") return;

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = node.value.split(urlRegex);

      if (parts.length === 1) return;

      const newNodes = [];

      parts.forEach((part) => {
        if (urlRegex.test(part)) {
          newNodes.push({
            type: "element",
            tagName: "a",
            properties: {
              href: part,
              target: "_blank",
              rel: "noopener noreferrer",
              className: [
                "text-blue-600",
                "dark:text-blue-400",
                "underline",
                "hover:opacity-80",
              ],
            },
            children: [{ type: "text", value: part }],
          });
        } else {
          newNodes.push({ type: "text", value: part });
        }
      });

      parent.children.splice(index, 1, ...newNodes);
    });
  };
}

export function MarkdownSafe({ content }) {
  if (!content || typeof content !== "string") {
    return <div className="text-gray-400">⚠️ No content to display</div>;
  }

  let clean = content;

  try {
    // Handle cases where backend returns JSON-stringified Markdown
    while (clean.startsWith('"') && clean.endsWith('"')) {
      clean = JSON.parse(clean);
    }
  } catch {
    /* ignore */
  }

  // Decode escaped markdown symbols and line breaks
  clean = clean
    .replaceAll("\\n", "\n")
    .replaceAll("\\|", "|")
    .replaceAll("\\t", "\t")
    .replaceAll("```", "")
    .trim();

  return (
    <div
      className="
        prose prose-sm sm:prose-base dark:prose-invert max-w-none
        prose-pre:bg-[#0d1117] prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-inner
        prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:font-mono prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:rounded
        prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:my-1 prose-li:my-0.5
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeLinkify]}
        components={{
          // 🧱 ChatGPT-style TABLE
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <table
                className="
                  min-w-full border-collapse text-sm
                  text-gray-800 dark:text-gray-200
                  rounded-lg overflow-hidden
                "
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              className="
                bg-gray-100 dark:bg-gray-800
                border-b border-gray-300 dark:border-gray-700
              "
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="
                px-4 py-2 text-left font-semibold
                text-gray-700 dark:text-gray-200
                border-r border-gray-300 dark:border-gray-700
                whitespace-nowrap
              "
              {...props}
            />
          ),
          tbody: ({ node, ...props }) => (
            <tbody
              className="divide-y divide-gray-200 dark:divide-gray-700"
              {...props}
            />
          ),
          tr: ({ node, ...props }) => (
            <tr
              className="
                odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              "
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="
                px-4 py-2 border-t border-gray-200 dark:border-gray-700
                text-gray-800 dark:text-gray-200
                align-top whitespace-nowrap
              "
              {...props}
            />
          ),

          pre: ({ children }) => (
            <pre className="not-prose bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto">
              {children}
            </pre>
          ),
          code: ({ inline, children }) =>
            inline ? (
              <code className="px-1 rounded bg-gray-100">{children}</code>
            ) : (
              <code>{children}</code>
            ),

          // 🧠 ChatGPT-style LISTS
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-5 space-y-1 marker:text-blue-500 dark:marker:text-blue-400"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-5 space-y-1 marker:text-blue-500 dark:marker:text-blue-400"
              {...props}
            />
          ),

          // 💬 ChatGPT-style BLOCKQUOTE
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="
                border-l-4 border-blue-500 pl-4 italic
                bg-gray-50 dark:bg-gray-800/50
                rounded-md my-3
              "
              {...props}
            />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:opacity-80"
            >
              {children}
            </a>
          ),
        }}
      >
        {clean}
      </ReactMarkdown>
    </div>
  );
}

function ChatMessage({ role, text, time }) {
  let content = null;
  try {
    const json = JSON.parse(text);
    if (typeof json === "object") {
      content = <JSONViewer data={json} />;
    }
  } catch {
    content = <MarkdownSafe content={String(text ?? "")} />;
  }

  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } transition-all`}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
          ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none"
          }
        `}
      >
        {content}
        <div className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">
          {time}
        </div>
      </div>
    </div>
  );
}

export default function ChatBox() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const now = new Date().toLocaleTimeString();
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text, time: now }]);

    try {
      const url = `${import.meta.env.VITE_MCP_HTTP_URL}/chat`;
      const res = await httpClient.post(url, { message: text });
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ Error: ${err.message}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    if (window.confirm("Clear all chat history?")) {
      localStorage.removeItem("chat_history");
      setMessages([]);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-lg font-semibold">🤖 UniDir Agent Chat</h1>
        <button
          onClick={clearHistory}
          className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Clear
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} time={m.time} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
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
