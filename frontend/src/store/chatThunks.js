import { addMessage, setLoading, setError, selectActiveMessages, selectActiveSession } from "./chatSlice";
import { api } from "../services/api";

// ── Detect plan type from bot reply ──────────────────────────────────────────
const detectPlanType = (text) => {
    const lower = text.toLowerCase();
    const isDiet =
        lower.includes("calorie") || lower.includes("breakfast") ||
        lower.includes("lunch") || lower.includes("dinner") ||
        lower.includes("meal") || lower.includes("diet") ||
        lower.includes("nutrition") || lower.includes("protein");
    const isExercise =
        lower.includes("sets") || lower.includes("reps") ||
        lower.includes("workout") || lower.includes("day 1") ||
        lower.includes("split") || lower.includes("push") ||
        lower.includes("pull") || lower.includes("legs");
    if (isDiet) return "diet";
    if (isExercise) return "exercise";
    return null;
};

// ── Extract deep memory facts ─────────────────────────────────────────────────
const extractMemoryFacts = (userText) => {
    const facts = [];
    const lower = userText.toLowerCase();

    if (lower.includes("lose weight") || lower.includes("weight loss"))
        facts.push({ key: "goal", value: "weight_loss", category: "fitness" });
    else if (lower.includes("gain muscle") || lower.includes("build muscle") || lower.includes("bulk"))
        facts.push({ key: "goal", value: "muscle_gain", category: "fitness" });
    else if (lower.includes("maintain"))
        facts.push({ key: "goal", value: "maintain", category: "fitness" });

    if (lower.includes("vegetarian"))
        facts.push({ key: "diet_type", value: "vegetarian", category: "diet" });
    else if (lower.includes("vegan"))
        facts.push({ key: "diet_type", value: "vegan", category: "diet" });
    else if (lower.includes("keto"))
        facts.push({ key: "diet_type", value: "keto", category: "diet" });

    if (lower.includes("knee pain") || lower.includes("knee injury"))
        facts.push({ key: "injury_knee", value: "true", category: "medical" });
    if (lower.includes("back pain") || lower.includes("back injury"))
        facts.push({ key: "injury_back", value: "true", category: "medical" });
    if (lower.includes("shoulder pain") || lower.includes("shoulder injury"))
        facts.push({ key: "injury_shoulder", value: "true", category: "medical" });

    if (lower.includes("beginner") || lower.includes("just started") || lower.includes("new to"))
        facts.push({ key: "experience", value: "beginner", category: "fitness" });
    else if (lower.includes("intermediate"))
        facts.push({ key: "experience", value: "intermediate", category: "fitness" });
    else if (lower.includes("advanced"))
        facts.push({ key: "experience", value: "advanced", category: "fitness" });

    const daysMatch = lower.match(/(\d)\s*days?\s*(a|per)\s*week/);
    if (daysMatch)
        facts.push({ key: "workout_days", value: daysMatch[1], category: "fitness" });

    return facts;
};

// ── Main thunk ────────────────────────────────────────────────────────────────
export const sendMessage = (inputText) => async (dispatch, getState) => {
    if (!inputText.trim()) return;

    const userMessage = {
        id: `user-${Date.now()}`,
        text: inputText.trim(),
        sender: "user",
        timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const state = getState();
        const { userProfile } = state.chat;

        // Get active session ID to pass to backend for chat history
        const activeSession = selectActiveSession(state);
        const sessionId = activeSession?.id || `session-${Date.now()}`;

        const activeMessages = selectActiveMessages(state);
        const history = activeMessages.slice(-10).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
        }));

        const response = await api.sendChatMessage({
            message: inputText.trim(),
            history,
            userProfile,
            sessionId,  // ← send session ID so backend saves chat history
        });

        const planType = response.planType || detectPlanType(response.reply || "");

        const botMessage = {
            id: `bot-${Date.now()}`,
            text: response.reply,
            sender: "bot",
            timestamp: new Date().toISOString(),
            source: response.source || "ai",
            videos: response.videos || null,
            videoMessage: response.videoMessage || null,
            planType: planType,
            planText: response.reply,
        };

        dispatch(addMessage(botMessage));

        // ── Save deep memory silently ─────────────────────────────────────────
        const token = localStorage.getItem("token");
        if (token) {
            const facts = extractMemoryFacts(inputText.trim());
            if (facts.length > 0) {
                api.upsertMemory(facts).catch((e) => {
                    console.warn("Memory save failed:", e.message);
                });
            }
        }

    } catch (err) {
        dispatch(
            addMessage({
                id: `err-${Date.now()}`,
                text: "Sorry, I couldn't process that request. Please check the server connection and try again.",
                sender: "bot",
                timestamp: new Date().toISOString(),
                isError: true,
            })
        );
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};