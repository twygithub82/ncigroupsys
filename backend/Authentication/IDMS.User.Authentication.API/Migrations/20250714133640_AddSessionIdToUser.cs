using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IDMS.UserAuthentication.Migrations
{
    /// <inheritdoc />
    public partial class AddSessionIdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3d069376-cd8f-433d-89b5-6fc3dae2fc73");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "702e6dc2-02ac-465c-9288-a2c277a5284b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8a0ab3c0-481d-4fc6-86d4-55664c257fcd");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "36b7c12a-b5e1-4621-aa64-7faa81c89b98", "b0473331-9b16-4757-aaa3-cc7f95b7e6bd" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "36b7c12a-b5e1-4621-aa64-7faa81c89b98");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b0473331-9b16-4757-aaa3-cc7f95b7e6bd");

            migrationBuilder.AddColumn<Guid>(
                name: "CurrentSessionId",
                table: "AspNetUsers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "functions",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    module = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    submodule = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    action = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    code = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    delete_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_dt = table.Column<long>(type: "bigint", nullable: true),
                    update_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    update_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_functions", x => x.guid);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "role",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    department = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    position = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    code = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    delete_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_dt = table.Column<long>(type: "bigint", nullable: true),
                    update_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    update_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role", x => x.guid);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "team",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    department_cv = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    delete_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_dt = table.Column<long>(type: "bigint", nullable: true),
                    update_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    update_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_team", x => x.guid);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_role",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    user_guid = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    role_guid = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    delete_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_dt = table.Column<long>(type: "bigint", nullable: true),
                    update_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    update_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_role", x => x.guid);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "role_functions",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    functions_guid = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    role_guid = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    roleguid = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    delete_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_dt = table.Column<long>(type: "bigint", nullable: true),
                    update_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    update_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role_functions", x => x.guid);
                    table.ForeignKey(
                        name: "FK_role_functions_functions_functions_guid",
                        column: x => x.functions_guid,
                        principalTable: "functions",
                        principalColumn: "guid");
                    table.ForeignKey(
                        name: "FK_role_functions_role_roleguid",
                        column: x => x.roleguid,
                        principalTable: "role",
                        principalColumn: "guid");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "team_user",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    userId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    team_guid = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    delete_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_dt = table.Column<long>(type: "bigint", nullable: true),
                    update_dt = table.Column<long>(type: "bigint", nullable: true),
                    create_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    update_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_team_user", x => x.guid);
                    table.ForeignKey(
                        name: "FK_team_user_team_team_guid",
                        column: x => x.team_guid,
                        principalTable: "team",
                        principalColumn: "guid");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "228be050-2b31-461e-9977-b3834f5cc431", "2", "User", "User" },
                    { "6b5c08af-d46d-480a-8d20-2bdb4ceb098d", "3", "HR", "HR" },
                    { "aa80b889-00f2-47f3-a057-a43ae76d0a24", "3", "Customer", "Customer" },
                    { "acf0e0d5-b3f2-4554-a1eb-1edf734aa5f1", "1", "Admin", "Admin" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CorporateID", "CurrentSessionId", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName", "isStaff" },
                values: new object[] { "2e0df440-e0f4-4f35-8a2f-1ab2fc73218f", 0, "1", 0, null, "admin@dwms.com", true, false, null, "admin@dwms.com", "admin", "AQAAAAIAAYagAAAAEAv50U8yR/yGI1IWULZfG4weRGaDIfJHuAqbjhK5CTQJB2FxD6lkxDXsgC3ZMK4fyw==", null, false, "", false, "admin", true });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "acf0e0d5-b3f2-4554-a1eb-1edf734aa5f1", "2e0df440-e0f4-4f35-8a2f-1ab2fc73218f" });

            migrationBuilder.CreateIndex(
                name: "IX_role_functions_functions_guid",
                table: "role_functions",
                column: "functions_guid");

            migrationBuilder.CreateIndex(
                name: "IX_role_functions_roleguid",
                table: "role_functions",
                column: "roleguid");

            migrationBuilder.CreateIndex(
                name: "IX_team_user_team_guid",
                table: "team_user",
                column: "team_guid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "role_functions");

            migrationBuilder.DropTable(
                name: "team_user");

            migrationBuilder.DropTable(
                name: "user_role");

            migrationBuilder.DropTable(
                name: "functions");

            migrationBuilder.DropTable(
                name: "role");

            migrationBuilder.DropTable(
                name: "team");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "228be050-2b31-461e-9977-b3834f5cc431");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6b5c08af-d46d-480a-8d20-2bdb4ceb098d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "aa80b889-00f2-47f3-a057-a43ae76d0a24");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "acf0e0d5-b3f2-4554-a1eb-1edf734aa5f1", "2e0df440-e0f4-4f35-8a2f-1ab2fc73218f" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "acf0e0d5-b3f2-4554-a1eb-1edf734aa5f1");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2e0df440-e0f4-4f35-8a2f-1ab2fc73218f");

            migrationBuilder.DropColumn(
                name: "CurrentSessionId",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "36b7c12a-b5e1-4621-aa64-7faa81c89b98", "1", "Admin", "Admin" },
                    { "3d069376-cd8f-433d-89b5-6fc3dae2fc73", "3", "Customer", "Customer" },
                    { "702e6dc2-02ac-465c-9288-a2c277a5284b", "2", "User", "User" },
                    { "8a0ab3c0-481d-4fc6-86d4-55664c257fcd", "3", "HR", "HR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CorporateID", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName", "isStaff" },
                values: new object[] { "b0473331-9b16-4757-aaa3-cc7f95b7e6bd", 0, "1", 0, "admin@dwms.com", true, false, null, "admin@dwms.com", null, "AQAAAAIAAYagAAAAEAv50U8yR/yGI1IWULZfG4weRGaDIfJHuAqbjhK5CTQJB2FxD6lkxDXsgC3ZMK4fyw==", null, false, "", false, "admin", true });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "36b7c12a-b5e1-4621-aa64-7faa81c89b98", "b0473331-9b16-4757-aaa3-cc7f95b7e6bd" });
        }
    }
}
