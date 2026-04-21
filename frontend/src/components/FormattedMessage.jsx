// src/components/FormattedMessage.js
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FormattedMessage = ({ text }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                table: ({ node, ...props }) => (
                    <div style={{ overflowX: "auto", marginTop: "10px" }}>
                        <table
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                fontSize: "13px",
                                color: "#e0d0ff",
                            }}
                            {...props}
                        />
                    </div>
                ),
                thead: ({ node, ...props }) => (
                    <thead style={{ backgroundColor: "rgba(126,58,228,0.4)" }} {...props} />
                ),
                th: ({ node, ...props }) => (
                    <th
                        style={{
                            padding: "8px 12px",
                            border: "1px solid rgba(126,58,228,0.3)",
                            textAlign: "left",
                            fontWeight: 600,
                        }}
                        {...props}
                    />
                ),
                td: ({ node, ...props }) => (
                    <td
                        style={{
                            padding: "7px 12px",
                            border: "1px solid rgba(126,58,228,0.2)",
                        }}
                        {...props}
                    />
                ),
                tr: ({ node, ...props }) => (
                    <tr
                        style={{ backgroundColor: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(126,58,228,0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        {...props}
                    />
                ),
                p: ({ node, ...props }) => (
                    <p style={{ margin: "4px 0", lineHeight: 1.6 }} {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul style={{ paddingLeft: "18px", margin: "6px 0" }} {...props} />
                ),
                li: ({ node, ...props }) => (
                    <li style={{ margin: "3px 0" }} {...props} />
                ),
                strong: ({ node, ...props }) => (
                    <strong style={{ color: "#b46cff" }} {...props} />
                ),
            }}
        >
            {text}
        </ReactMarkdown>
    );
};

export default FormattedMessage;