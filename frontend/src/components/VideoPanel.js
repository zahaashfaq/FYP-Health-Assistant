// src/components/VideoPanel.js
import React, { useState } from "react";
import { HeartFill, Heart } from "react-bootstrap-icons";
import { api } from "../services/api";

const VideoPanel = ({ videos, videoMessage }) => {
    const [likedIds, setLikedIds] = useState({});

    if (!videos || videos.length === 0) return null;

    const handleLike = async (video) => {
        try {
            const result = await api.likeVideo({
                videoId: video.id || video.videoId,
                title: video.title,
                thumbnailUrl: video.thumbnail,
                youtubeUrl: video.url || `https://youtube.com/watch?v=${video.id}`,
            });
            setLikedIds((prev) => ({ ...prev, [video.id]: result.liked }));
        } catch (e) {
            console.error("Like failed", e);
        }
    };

    return (
        <div style={{ marginTop: "10px" }}>
            {videoMessage && (
                <p style={{ fontSize: "13px", color: "#b46cff", marginBottom: "8px" }}>
                    {videoMessage}
                </p>
            )}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {videos.map((video) => (
                    <div
                        key={video.id}
                        style={{
                            width: "200px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            backgroundColor: "rgba(60,40,80,0.8)",
                            border: "1px solid #2c1a4b",
                            position: "relative",
                        }}
                    >
                        <a href={video.url || `https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                style={{ width: "100%", height: "110px", objectFit: "cover" }}
                            />
                        </a>
                        <div style={{ padding: "8px" }}>
                            <p style={{ fontSize: "12px", color: "#ddd", margin: 0, lineHeight: 1.4 }}>
                                {video.title?.slice(0, 60)}
                            </p>
                        </div>
                        {/* Like button */}
                        <button
                            onClick={() => handleLike(video)}
                            style={{
                                position: "absolute", top: "6px", right: "6px",
                                background: "rgba(0,0,0,0.5)", border: "none",
                                borderRadius: "50%", padding: "5px", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            {likedIds[video.id]
                                ? <HeartFill size={14} color="#e74c3c" />
                                : <Heart size={14} color="#fff" />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPanel;