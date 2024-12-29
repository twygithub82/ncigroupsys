using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IDMS.UserAuthentication.Migrations
{
    /// <inheritdoc />
    public partial class update_script_toadd_staff_admin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1c08e1b4-8093-4a6e-8302-1014262ed1af");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9706b2ac-3d61-49c0-8520-caad20ec016b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a4869aad-46e3-44be-8c63-8effbd219c7d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b62bd988-ca0c-41b0-b7a8-178396ebe6c3");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1c08e1b4-8093-4a6e-8302-1014262ed1af", "2", "User", "User" },
                    { "9706b2ac-3d61-49c0-8520-caad20ec016b", "1", "Admin", "Admin" },
                    { "a4869aad-46e3-44be-8c63-8effbd219c7d", "3", "HR", "HR" },
                    { "b62bd988-ca0c-41b0-b7a8-178396ebe6c3", "3", "Customer", "Customer" }
                });
        }
    }
}
