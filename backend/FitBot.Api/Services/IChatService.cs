// Services/IChatService.cs
using FitBot.Api.DTOs;
using FitBot.Api.Models;

namespace FitBot.Api.Services
{
    public interface IChatService
    {
        /// <summary>
        /// Routes the message to the correct AI (OpenAI / Gemini / Spoonacular)
        /// and returns the reply along with the source label.
        /// </summary>
        Task<ChatResponseDto> GetAiResponseAsync(
            string message,
            List<ChatHistoryItem> history,
            UserProfile? profile);

        Task<List<object>> GetHistoryAsync(int userId);
    }
}