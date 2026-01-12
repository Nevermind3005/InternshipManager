using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddStudyProgram : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "study_program_id",
                table: "internships",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "study_programs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    code = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_study_programs", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_internships_study_program_id",
                table: "internships",
                column: "study_program_id");

            migrationBuilder.CreateIndex(
                name: "ix_study_programs_code",
                table: "study_programs",
                column: "code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_internships_study_programs_study_program_id",
                table: "internships",
                column: "study_program_id",
                principalTable: "study_programs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_internships_study_programs_study_program_id",
                table: "internships");

            migrationBuilder.DropTable(
                name: "study_programs");

            migrationBuilder.DropIndex(
                name: "ix_internships_study_program_id",
                table: "internships");

            migrationBuilder.DropColumn(
                name: "study_program_id",
                table: "internships");
        }
    }
}
