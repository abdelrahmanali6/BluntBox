using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BluntBox.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserUniqueIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "LinkSlug",
                table: "Users",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_LinkSlug",
                table: "Users",
                column: "LinkSlug",
                unique: true,
                filter: "[LinkSlug] IS NOT NULL");

            // Ensure duplicate usernames are made unique before creating the unique index.
            // This updates any duplicate UserName rows (keeping the first) by appending a short GUID fragment.
            migrationBuilder.Sql(@"
;WITH dup AS (
    SELECT Id, UserName,
        ROW_NUMBER() OVER (PARTITION BY LOWER(UserName) ORDER BY Id) AS rn
    FROM Users
)
UPDATE u
SET UserName = u.UserName + '-' + LEFT(CONVERT(varchar(36), NEWID()), 8)
FROM Users u
JOIN dup d ON u.Id = d.Id
WHERE d.rn > 1;
");

            // Create unique index if it does not already exist (safe if migration partially applied)
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT 1 FROM sys.indexes i WHERE i.name = 'IX_Users_UserName' AND i.object_id = OBJECT_ID('Users'))
BEGIN
    CREATE UNIQUE INDEX [IX_Users_UserName] ON [Users] ([UserName]);
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_LinkSlug",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserName",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "LinkSlug",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
