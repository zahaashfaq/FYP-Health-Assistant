using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitBot.Api.Migrations
{
    /// <inheritdoc />
    public partial class addtargetweight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "TargetWeight",
                table: "UserProfiles",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetWeight",
                table: "UserProfiles");
        }
    }
}
