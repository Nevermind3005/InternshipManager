using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddInternshipDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_report_approved_by_company",
                table: "internships",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_supporting_docs_approved_by_company",
                table: "internships",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "type",
                table: "internships",
                type: "text",
                nullable: false,
                defaultValue: "Unpaid");

            migrationBuilder.CreateTable(
                name: "internship_documents",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    internship_id = table.Column<Guid>(type: "uuid", nullable: false),
                    slot = table.Column<string>(type: "text", nullable: false),
                    uploaded_by = table.Column<string>(type: "text", nullable: false),
                    file_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    s3key = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_internship_documents", x => x.id);
                    table.ForeignKey(
                        name: "fk_internship_documents_internships_internship_id",
                        column: x => x.internship_id,
                        principalTable: "internships",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_internship_documents_internship_id_slot_uploaded_by",
                table: "internship_documents",
                columns: new[] { "internship_id", "slot", "uploaded_by" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "internship_documents");

            migrationBuilder.DropColumn(
                name: "is_report_approved_by_company",
                table: "internships");

            migrationBuilder.DropColumn(
                name: "is_supporting_docs_approved_by_company",
                table: "internships");

            migrationBuilder.DropColumn(
                name: "type",
                table: "internships");
        }
    }
}
