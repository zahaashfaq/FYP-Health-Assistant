namespace FitBot.Api.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }

        public string Message { get; set; } = string.Empty;
        public bool IsBot { get; set; } 
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
