namespace FitBot.Api.DTOs
{
    public class SavePlanDto
    {
        public string Title { get; set; } = "";
        public string PlanType { get; set; } = "";   // for diet: weekly/monthly; for exercise: split type
        public string PlanJson { get; set; } = "";
    }

}
