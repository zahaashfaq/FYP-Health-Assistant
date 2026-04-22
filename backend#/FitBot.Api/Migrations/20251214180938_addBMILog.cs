using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitBot.Api.Migrations
{
    /// <inheritdoc />
    public partial class addBMILog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BmiLog_Users_UserId",
                table: "BmiLog");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BmiLog",
                table: "BmiLog");

            migrationBuilder.RenameTable(
                name: "BmiLog",
                newName: "BmiLogs");

            migrationBuilder.RenameIndex(
                name: "IX_BmiLog_UserId",
                table: "BmiLogs",
                newName: "IX_BmiLogs_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BmiLogs",
                table: "BmiLogs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BmiLogs_Users_UserId",
                table: "BmiLogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BmiLogs_Users_UserId",
                table: "BmiLogs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BmiLogs",
                table: "BmiLogs");

            migrationBuilder.RenameTable(
                name: "BmiLogs",
                newName: "BmiLog");

            migrationBuilder.RenameIndex(
                name: "IX_BmiLogs_UserId",
                table: "BmiLog",
                newName: "IX_BmiLog_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BmiLog",
                table: "BmiLog",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BmiLog_Users_UserId",
                table: "BmiLog",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
