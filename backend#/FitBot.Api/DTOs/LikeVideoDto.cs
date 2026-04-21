namespace FitBot.Api.DTOs
{
    public class LikeVideoDto
    {
        public string VideoId { get; set; } = "";
        public string Title { get; set; } = "";
        public string? ThumbnailUrl { get; set; }
        public string YoutubeUrl { get; set; } = "";
    }
}