using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IDMS.UserAuthentication.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserSchema_CustomerCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<string>(
                name: "ActivationCode",
                table: "AspNetUsers",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CustomerCompnayGuid",
                table: "AspNetUsers",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "LicenseToken",
                table: "AspNetUsers",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_functions",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    functions_guid = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    user_guid = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    adhoc = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    remarks = table.Column<string>(type: "longtext", nullable: true)
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
                    table.PrimaryKey("PK_user_functions", x => x.guid);
                    table.ForeignKey(
                        name: "FK_user_functions_functions_functions_guid",
                        column: x => x.functions_guid,
                        principalTable: "functions",
                        principalColumn: "guid");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_license",
                columns: table => new
                {
                    guid = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    license_key = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    user_email = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    create_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    create_dt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    update_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    update_dt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    delete_dt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_license", x => x.guid);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2e857d30-9a2b-4339-823f-7e4fc2bb572c", "3", "Customer", "Customer" },
                    { "30ddf2f9-268b-4dd5-905c-39ad95092428", "3", "HR", "HR" },
                    { "5b0257d5-8f76-4f7c-85c7-3ffe2df48cbe", "2", "User", "User" },
                    { "9092ff9e-39b5-4dca-89f7-cabc7b88bd6e", "1", "Admin", "Admin" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ActivationCode", "ConcurrencyStamp", "CorporateID", "CurrentSessionId", "CustomerCompnayGuid", "Email", "EmailConfirmed", "LicenseToken", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName", "isStaff" },
                values: new object[] { "2292d252-2b6a-4d8f-b3f0-914ea543aa94", 0, "", "1", 0, null, "", "admin@dwms.com", true, "", false, null, "admin@dwms.com", "admin", "AQAAAAIAAYagAAAAEAv50U8yR/yGI1IWULZfG4weRGaDIfJHuAqbjhK5CTQJB2FxD6lkxDXsgC3ZMK4fyw==", null, false, "", false, "admin", true });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "9092ff9e-39b5-4dca-89f7-cabc7b88bd6e", "2292d252-2b6a-4d8f-b3f0-914ea543aa94" });

            migrationBuilder.CreateIndex(
                name: "IX_user_functions_functions_guid",
                table: "user_functions",
                column: "functions_guid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_functions");

            migrationBuilder.DropTable(
                name: "user_license");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2e857d30-9a2b-4339-823f-7e4fc2bb572c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "30ddf2f9-268b-4dd5-905c-39ad95092428");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5b0257d5-8f76-4f7c-85c7-3ffe2df48cbe");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "9092ff9e-39b5-4dca-89f7-cabc7b88bd6e", "2292d252-2b6a-4d8f-b3f0-914ea543aa94" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9092ff9e-39b5-4dca-89f7-cabc7b88bd6e");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2292d252-2b6a-4d8f-b3f0-914ea543aa94");

            migrationBuilder.DropColumn(
                name: "ActivationCode",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CustomerCompnayGuid",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LicenseToken",
                table: "AspNetUsers");

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
        }
    }
}
