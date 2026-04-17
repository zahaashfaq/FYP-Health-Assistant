namespace FitBot.Api.DTOs
{
    public class UserProfileDto
    {
        public int Age { get; set; }
        public string Gender { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }
        public string HealthIssues { get; set; }
      
        public float TargetWeight { get; set; }
    }
}
