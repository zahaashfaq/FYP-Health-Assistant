// Controllers/ChatController.cs
using FitBot.Api.DTOs;
using FitBot.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitBot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IProfileService _profileService;

        public ChatController(IChatService chatService, IProfileService profileService)
        {
            _chatService = chatService;
            _profileService = profileService;
        }

        [HttpPost("message")]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                    return Unauthorized();

                // Always fetch the real profile from DB (more authoritative than frontend payload)
                var user = await _profileService.GetUserByUsernameAsync(username);
                var profile = user?.Profile;

                var result = await _chatService.GetAiResponseAsync(request.Message, request.History, profile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine("CHAT ERROR: " + ex.Message);
                return StatusCode(500, new { reply = "Sorry, I encountered an error. Please try again.", source = "error" });
            }
        }

        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetHistory()
        {
            // Returns last 50 messages for this user (optional persistence)
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var user = await _profileService.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            var history = await _chatService.GetHistoryAsync(user.Id);
            return Ok(history);
        }
    }
}