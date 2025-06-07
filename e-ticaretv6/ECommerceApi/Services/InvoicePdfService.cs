using ECommerceApi.Dtos;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ECommerceApi.Services
{
    public class InvoicePdfService
    {
        public byte[] Generate(InvoiceDto invoice)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);
                    page.Size(PageSizes.A4);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header().Text($"Invoice #{invoice.OrderId}")
                        .SemiBold().FontSize(18).FontColor(Colors.Blue.Darken2);

                    page.Content().PaddingVertical(10).Column(col =>
                    {
                        col.Item().Text($"Customer: {invoice.FullName} ({invoice.Email})");
                        col.Item().Text($"Date: {invoice.OrderDate:dd.MM.yyyy}");
                        col.Item().Text($"Status: {invoice.Status}");

                        col.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.ConstantColumn(60);
                                columns.ConstantColumn(60);
                                columns.RelativeColumn();
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Product");
                                header.Cell().Text("Price");
                                header.Cell().Text("Qty");
                                header.Cell().Text("Color");
                            });

                            foreach (var item in invoice.Items)
                            {
                                table.Cell().Text(item.ProductName);
                                table.Cell().Text($"{item.Price:C}");
                                table.Cell().Text(item.Quantity.ToString());
                                table.Cell().Text(!string.IsNullOrWhiteSpace(item.ColorName) ? item.ColorName : "-");
                            }
                        });

                        col.Item().PaddingTop(15).AlignRight()
                            .Text($"Total: {invoice.TotalAmount:C}").Bold();
                    });

                    page.Footer().AlignCenter().Text("Thank you for your order!").Italic();
                });
            });

            return document.GeneratePdf();
        }
    }
}
