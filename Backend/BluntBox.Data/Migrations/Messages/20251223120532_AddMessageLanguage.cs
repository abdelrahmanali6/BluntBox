using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BluntBox.Data.Migrations.Messages
{
    /// <inheritdoc />
    public partial class AddMessageLanguage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Messages",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "en");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "Messages");
        }
    }
}
