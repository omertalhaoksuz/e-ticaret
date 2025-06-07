using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderItem_ColorFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_ColorOptions_ColorOptionId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Menus_MenuId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_SubMenus_SubMenuId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ColorOptionId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "ColorOptionId",
                table: "OrderItems");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Menus_MenuId",
                table: "Products",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_SubMenus_SubMenuId",
                table: "Products",
                column: "SubMenuId",
                principalTable: "SubMenus",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Menus_MenuId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_SubMenus_SubMenuId",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "ColorOptionId",
                table: "OrderItems",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ColorOptionId",
                table: "OrderItems",
                column: "ColorOptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_ColorOptions_ColorOptionId",
                table: "OrderItems",
                column: "ColorOptionId",
                principalTable: "ColorOptions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Menus_MenuId",
                table: "Products",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_SubMenus_SubMenuId",
                table: "Products",
                column: "SubMenuId",
                principalTable: "SubMenus",
                principalColumn: "Id");
        }
    }
}
