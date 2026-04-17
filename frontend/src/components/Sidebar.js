// src/components/Sidebar.js
import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import {
  PlusLg,
  ChatLeftText,
  List,
  Search,
  ChevronDown,
  ChevronRight,
  Trash,
  PencilSquare,
  CheckLg,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createSession,
  switchSession,
  deleteSession,
  renameSession,
  selectActiveMessages,
} from "../store/chatSlice";

// ── Single session row with dropdown messages ────────────────────────────────
const SessionRow = ({ session, isActive, isOpen: sidebarOpen }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(isActive);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);

  const userMessages = session.messages.filter((m) => m.sender === "user");

  const handleRename = () => {
    if (editTitle.trim()) {
      dispatch(renameSession({ id: session.id, title: editTitle.trim() }));
    }
    setEditing(false);
  };

  if (!sidebarOpen) {
    // Collapsed sidebar: just show icon
    return (
      <div
        className={`history-item ${isActive ? "history-item-active" : ""}`}
        onClick={() => dispatch(switchSession(session.id))}
        title={session.title}
      >
        <ChatLeftText size={14} />
      </div>
    );
  }

  return (
    <div className={`session-block ${isActive ? "session-block-active" : ""}`}>
      {/* Session header row */}
      <div className="session-header-row">
        {/* Expand/collapse toggle */}
        <button
          className="session-expand-btn"
          onClick={() => setExpanded((p) => !p)}
          title={expanded ? "Collapse" : "Expand messages"}
        >
          {userMessages.length > 0 ? (
            expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : (
            <span style={{ width: 12 }} />
          )}
        </button>

        {/* Title / edit field */}
        {editing ? (
          <input
            className="session-rename-input"
            value={editTitle}
            autoFocus
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <span
            className="session-title"
            onClick={() => dispatch(switchSession(session.id))}
            title={session.title}
          >
            {session.title}
          </span>
        )}

        {/* Action buttons — shown on hover */}
        <div className="session-actions">
          {editing ? (
            <button className="session-action-btn" onClick={handleRename} title="Save">
              <CheckLg size={12} />
            </button>
          ) : (
            <>
              <button
                className="session-action-btn"
                onClick={() => { setEditing(true); setEditTitle(session.title); }}
                title="Rename"
              >
                <PencilSquare size={12} />
              </button>
              <button
                className="session-action-btn session-delete-btn"
                onClick={() => dispatch(deleteSession(session.id))}
                title="Delete"
              >
                <Trash size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dropdown: user messages inside this session */}
      {expanded && userMessages.length > 0 && (
        <div className="session-messages-list">
          {userMessages.map((msg) => (
            <div
              key={msg.id}
              className="session-message-item"
              onClick={() => dispatch(switchSession(session.id))}
              title={msg.text}
            >
              <span className="msg-dot" />
              <span className="session-message-text">{msg.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Sidebar ──────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, setIsOpen, width, setWidth }) => {
  const dispatch = useDispatch();
  const { sessions, activeId } = useSelector((s) => s.chat);
  const [searchQuery, setSearchQuery] = useState("");

  const isResizing = React.useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };
  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const w = e.clientX;
    if (w > 160 && w < 500) setWidth(w);
  };
  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(
      (m) =>
        m.sender === "user" &&
        m.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      style={{ width: isOpen ? `${width}px` : "70px" }}
    >
      <div className="sidebar-fixed-top">
        {/* Menu toggle */}
        <div className="sidebar-header">
          <Button
            variant="link"
            className="menu-btn p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <List size={24} color="#fff" />
          </Button>
        </div>

        {/* New Chat button */}
        <div className="new-chat-container px-2">
          <Button
            className={`new-chat-btn ${!isOpen ? "collapsed-fab" : ""}`}
            onClick={() => dispatch(createSession())}
          >
            <PlusLg size={20} />
            {isOpen && <span className="ms-3">New Chat</span>}
          </Button>
        </div>

        {/* Search */}
        {isOpen && (
          <div className="search-section px-2 mt-3 fade-in">
            <InputGroup className="search-input-group">
              <InputGroup.Text>
                <Search size={14} color="#888" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
        )}
      </div>

      {/* Scrollable session list */}
      <div className="sidebar-scrollable-content">
        {isOpen && (
          <div className="history-section mt-2 px-1 fade-in">
            <p className="text-muted small fw-bold px-2 mb-2">Chats</p>

            {filteredSessions.length === 0 && (
              <p
                className="text-muted px-3"
                style={{ fontSize: "12px", opacity: 0.6 }}
              >
                No chats found.
              </p>
            )}

            {filteredSessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                isActive={session.id === activeId}
                isOpen={isOpen}
              />
            ))}
          </div>
        )}

        {/* Collapsed: just icons */}
        {!isOpen &&
          sessions.slice(0, 12).map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              isActive={session.id === activeId}
              isOpen={false}
            />
          ))}
      </div>

      {isOpen && <div className="resizer" onMouseDown={startResizing} />}
    </div>
  );
};

export default Sidebar;