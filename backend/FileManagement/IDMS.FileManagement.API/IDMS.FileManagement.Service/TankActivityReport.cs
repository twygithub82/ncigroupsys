using IDMS.FileManagement.Interface.DB;
using IDMS.FileManagement.Interface.Model;
using Microsoft.Extensions.Configuration;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using TimeZoneConverter;

namespace IDMS.FileManagement.Service
{
    public class TankActivityReport : IDocument
    {
        private List<daily_tank_activity_result>? _data = new List<daily_tank_activity_result>();
        private CustomerGroup _customerGroup = new CustomerGroup();
        private readonly ReportSettings _settings;
        private readonly string _webRootPath;


        public TankActivityReport(ReportSettings reportSetting, string webRootPath)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            _settings = reportSetting;
            _webRootPath = webRootPath;
        }

        public void LoadData(List<daily_tank_activity_result>? data, CustomerGroup? data1)
        {
            _data = data;
            _customerGroup = data1;

            Helper.InitHelper(_settings);
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            // Define the desired font family for the entire report.
            const string desiredFont = Fonts.Calibri;
            var headerNameFontSize = 9;
            var reportTitleFontSize = 14;
            var subTitleFontSize = 9;
            var footerFontSize = 7;
            var customerName = _customerGroup.CustomerName ?? "";
            var tankStatus = "In Yard";

            container
                .Page(page =>
                {
                    page.DefaultTextStyle(TextStyle.Default.FontFamily("Helvetica"));
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(15);

                    // --- 1. Header Section (Company Details & Report Title) ---
                    //page.Header()
                    //        .Column(column =>
                    //        {
                    //            // Create a row: left = text, right = logo
                    //            column.Item().Row(row =>
                    //            {

                    //                // --- LEFT: Company Name and Details ---
                    //                row.RelativeItem().PaddingTop(15).Column(col =>
                    //                {
                    //                    col.Item().Text("NCI GLOBAL PTE LTD").FontSize(headerNameFontSize);//.FontFamily(desiredFont);
                    //                    col.Item().Text("CRN: 202335130H").FontSize(headerNameFontSize);//.FontFamily(desiredFont);
                    //                    col.Item().Text("10G Enterprise Road, Enterprise 10, Singapore 629833").FontSize(headerNameFontSize);//.FontFamily(desiredFont);
                    //                    col.Item().Text("T: +65 6517 9848  W: nci.com.sg").FontSize(headerNameFontSize);//.FontFamily(desiredFont);
                    //                });

                    //                // --- RIGHT: Company Logo ---
                    //                row.ConstantItem(155) // Adjust width for your logo
                    //                    .AlignRight()
                    //                    .AlignMiddle()
                    //                    .Image("C:\\Users\\EdmundTING\\Desktop\\Tester\\testPDF\\testPDF\\report-logo.png") //your logo file path or image source
                    //                    .FitWidth(); // Or .FitHeight() depending on proportions
                    //            });

                    //            // --- Divider line ---
                    //            column.Item().PaddingTop(5).LineHorizontal(0.5f).LineColor(Colors.Grey.Medium);
                    //            column.Item().PaddingTop(13); // Add some spacing


                    //            // Report Title
                    //            column.Item()
                    //                .AlignCenter().AlignMiddle()
                    //                .Text($"Tank Activity Report : {customerName}")
                    //                .FontSize(reportTitleFontSize);

                    //            //// --- Subtitle (e.g., Customer Name) ---
                    //            //column.Item()
                    //            //    .PaddingTop(10)
                    //            //    .AlignLeft() // optional; default alignment
                    //            //    .Text($"Tank Status: {_data?.FirstOrDefault()?.in_yard_cv ?? ""}") // dynamic value
                    //            //    .FontSize(subTitleFontSize);
                    //        });

                    page.Header().Component(new ReportHeaderComponent($"Tank Activity Report : {customerName}", _settings, webRootPath: _webRootPath, "Any Sub-Title here"));



                    // --- 2. Report Status/Detail Section ---
                    page.Content()
                        .Column(column =>
                        {
                            column.Spacing(5);

                            //// Report Title
                            //column.Item()
                            //    .AlignCenter().AlignMiddle()
                            //    .Text($"Tank Activity Report : {customerName}")
                            //    .FontSize(reportTitleFontSize);

                            //// --- Subtitle (e.g., Customer Name) ---
                            //column.Item()
                            //    .PaddingTop(10)
                            //    .AlignLeft() // optional; default alignment
                            //    .Text($"Tank Status: {_data.FirstOrDefault().Yard}") // dynamic value
                            //    .FontSize(subTitleFontSize);

                            // Main Content (Table)
                            column.Item().PaddingTop(_settings.ShowSubtitle ? 5 : 10).Component(new TankActivityTableComponent(_data, _settings));
                        });

                    // --- 4. Footer Section (Legend and Page Number) ---
                    page.Footer()
                        .PaddingTop(8)
                        .Column(column =>
                        {
                            // --- Divider Line ---
                            column.Item().PaddingBottom(4).LineHorizontal(0.5f).LineColor(Colors.Grey.Medium);

                            // --- Footer Row: Legend and Page Number ---
                            column.Item().Row(row =>
                            {
                                // --- LEFT: Legend ---
                                row.RelativeItem().AlignLeft().Text(text =>
                                {
                                    text.DefaultTextStyle(TextStyle.Default.FontSize(footerFontSize));
                                    text.Span("SO: SO Generated / IG: In Gate / IS: In Survey / SE: Steam / RE: Residue / C: Cleaning / R|I: Repair / S: Storage / RO: RO Generated / OG: Out Gate / OS: Out Survey / RL: Released");
                                });

                                // --- RIGHT: Page Number ---
                                row.ConstantItem(120) // adjust width as needed
                                    .AlignRight()
                                    .Text(text =>
                                    {
                                        text.Span("Page ").FontSize(footerFontSize);
                                        text.CurrentPageNumber().FontSize(footerFontSize);
                                        text.Span(" of ").FontSize(footerFontSize);
                                        text.TotalPages().FontSize(footerFontSize);
                                    });
                            });
                        });

                });
        }
    }

    public class TankActivityTableComponent : IComponent
    {
        private readonly List<daily_tank_activity_result> _data;
        private readonly ReportSettings _setting;

        public TankActivityTableComponent(List<daily_tank_activity_result> data, ReportSettings setting)
        {
            _data = data;
            _setting = setting;
        }

        public void Compose(IContainer container)
        {
            container.Table(table =>
            {
                // Table Properties
                table.ColumnsDefinition(columns =>
                {
                    // Assign relative widths. This will require some tweaking to match the PDF.
                    columns.RelativeColumn(0.4f); // S/N
                    columns.RelativeColumn(1.1f); // Tank No
                    columns.RelativeColumn(0.8f); // In Date
                    columns.RelativeColumn(1.1f); // TakeIn-Ref
                    columns.RelativeColumn(0.6f); // Capacity
                    columns.RelativeColumn(0.7f); // Tare Weight
                    columns.RelativeColumn(1.5f); // Last Cargo
                    columns.RelativeColumn(0.8f); // Clean Date
                    columns.RelativeColumn(0.55f); // Owner
                    columns.RelativeColumn(1.2f); // Last Test
                    columns.RelativeColumn(0.9f); // Next Test
                    columns.RelativeColumn(1.2f); // Estimate No
                    columns.RelativeColumn(0.9f); // Estimate Date
                    columns.RelativeColumn(1.1f); // Approval Ref
                    columns.RelativeColumn(0.8f); // AV Date
                    columns.RelativeColumn(0.8f); // Clean Cert Date
                    columns.RelativeColumn(0.8f); // Release Booking
                    columns.RelativeColumn(0.8f); // Release Date
                    columns.RelativeColumn(1.1f); // Release Ref
                    columns.RelativeColumn(0.7f); // Status
                    columns.RelativeColumn(0.7f); // Purpose
                    columns.RelativeColumn(1.1f); // Remarks
                    columns.RelativeColumn(0.7f); // Yard
                });

                // Replicate the merged header rows (Header 1, Header 2)
                table.Header(header =>
                {

                    var headerCellFontSize = 5.5f;
                    var headerCellBackground = Colors.Grey.Lighten2;

                    var borderColor = Colors.Grey.Lighten1;//your global color
                    var borderThickness = 0.15f;

                    // Header Row 1: Merged Titles (Tank Details, Maintenance Details, Release Details)
                    var cellStyle = TextStyle.Default.Bold().FontSize(headerCellFontSize);

                    // Tank Details (S/N to Last Cargo - 7 columns)
                    header.Cell().ColumnSpan(7).Background(headerCellBackground).Border(borderThickness, borderColor).Padding(3).Text("Tank Details").Style(cellStyle).AlignCenter();

                    // Maintenance Details (Clean Date to Clean Cert Date - 9 columns)
                    header.Cell().ColumnSpan(9).Background(headerCellBackground).Border(borderThickness, borderColor).Padding(3).Text("Maintenance Details").Style(cellStyle).AlignCenter();

                    // Release Details (Release Booking to Status - 4 columns)
                    header.Cell().ColumnSpan(7).Background(headerCellBackground).Border(borderThickness, borderColor).Padding(3).Text("Release Details").Style(cellStyle).AlignCenter();

                    // Remaining Single Columns (Purpose, Remarks Yard - 2 columns)
                    //header.Cell().Border(borderThickness, borderColor).Padding(2).Text("Purpose").Style(cellStyle).AlignCenter();
                    //header.Cell().Border(borderThickness, borderColor).Padding(2).Text("Remarks Yard").Style(cellStyle).AlignCenter();

                    // Header Row 2: Individual Column Headers (Requires many cells)
                    var header2Style = TextStyle.Default.Bold().FontSize(headerCellFontSize);


                    Func<IContainer, IContainer> HeaderCellStyle = cell => cell
                        .Border(borderThickness, borderColor)
                        .Background(headerCellBackground)
                        .Padding(1)
                        .AlignMiddle()
                        .AlignCenter();

                    // Tank Details
                    header.Cell().Element(HeaderCellStyle).Text("S/N").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Tank No").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("In Date").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("TakeIn-Ref").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Capacity").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Tare Weight").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Last Cargo").Style(header2Style).AlignCenter();

                    // Maintenance Details
                    header.Cell().Element(HeaderCellStyle).Text("Clean Date").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Owner").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Last Test").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Next Test").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Estimate No").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Estimate Date").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Approval Ref").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("AV Date").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Clean Cert Date").Style(header2Style).AlignCenter();

                    // Release Details
                    header.Cell().Element(HeaderCellStyle).Text("Release Booking").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Release Date").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Release Ref").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Status").Style(header2Style).AlignCenter();

                    // Remaining Single Columns
                    header.Cell().Element(HeaderCellStyle).Text("Purpose").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Remarks").Style(header2Style).AlignCenter();
                    header.Cell().Element(HeaderCellStyle).Text("Yard").Style(header2Style).AlignCenter();
                });

                // Data Rows
                var dataStyle = TextStyle.Default.FontSize(5).FontColor(Colors.Grey.Darken2);

                var borderColor = Colors.Grey.Lighten2;//your global color
                var borderThickness = 0.25f;
                var cellHeight = 15;

                Func<IContainer, IContainer> BaseCellStyle = cell => cell
                    .MinHeight(cellHeight)
                    .Border(borderThickness, borderColor)
                    .Padding(1)
                    .AlignMiddle()
                    .AlignCenter();

                var TimeZoneId = "Asia/Singapore";
                var SN = 0;
                string? prevTankNo = null;

                foreach (var item in _data)
                {
                    bool isSameTank = item.tank_no == prevTankNo;

                    if (!isSameTank)
                        SN++; // Only increment for a new tank

                    var AVDate = Helper.GetAVDate(item.purpose_storage, item.purpose_cleaning, item.purpose_steam, item.purpose_repair_cv,
                                                    item.clean_date, item.steam_date, item.av_date, item.in_date);

                    table.Cell().Element(BaseCellStyle).Text(isSameTank ? "" : SN.ToString()).Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text(isSameTank ? "" : item.tank_no).ClampLines(1, " ...").Style(dataStyle);
                    table.Cell().Element(BaseCellStyle)
                    .Text(isSameTank ? "" : (string)Helper.ConvertEpochToLocalTime(item.in_date, "dd/MM/yyyy"))
                    .Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text(isSameTank ? "" : item.take_in_ref).ClampLines(1, " ...").Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text(isSameTank ? "" : item.capacity.ToString()).Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text(isSameTank ? "" : item.tare_weight.ToString()).Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text(isSameTank ? "" : item.last_cargo).ClampLines(1, " ...").Style(dataStyle).AlignStart();
                    table.Cell().Element(BaseCellStyle)
                    .Text(isSameTank ? "" : (string)Helper.ConvertEpochToLocalTime(item.clean_date, "dd/MM/yyyy"))
                    .Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text(isSameTank ? "" : item.owner).Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle)
                    .Text(isSameTank ? "" : Helper.DisplayLastTest(item.test_date, item.last_test ?? "", item.test_class_cv ?? ""))
                    .Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle)
                    .Text(isSameTank ? "" : Helper.DisplayNextTest(item.test_date, item.next_test ?? ""))
                    .Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text(item.estimate_no).ClampLines(1, " ...").Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text((string)Helper.ConvertEpochToLocalTime(item.estimate_date, "dd/MM/yyyy")).Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text(item.approval_ref).ClampLines(1, " ...").Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text((string)Helper.ConvertEpochToLocalTime(AVDate, "dd/MM/yyyy")).Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text((string)Helper.ConvertEpochToLocalTime(item.clean_cert_date, "dd/MM/yyyy")).Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text((string)Helper.ConvertEpochToLocalTime(item.release_booking, "dd/MM/yyyy")).ClampLines(1, " ...").Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text((string)Helper.ConvertEpochToLocalTime(item.release_date, "dd/MM/yyyy")).Style(dataStyle).AlignCenter();
                    table.Cell().Element(BaseCellStyle).Text(item.release_date is null ? "" : item.release_ref).AlignLeft().ClampLines(1, " ...").Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text(Helper.DisplayTankStatusInShort(item.status ?? "")).Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text(Helper.DisplayTankPurposeInShort(item.purpose_storage, item.purpose_cleaning, item.purpose_steam, item.purpose_repair_cv ?? "")).Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text(item.remarks).ClampLines(1, " ...").Style(dataStyle);
                    table.Cell().Element(BaseCellStyle).Text(item.release_date == null ? item.in_yard_cv?.Replace("_", " ") : item.out_yard_cv?.Replace("_", " ")).Style(dataStyle).AlignCenter();

                    prevTankNo = item.tank_no;
                }
            });
        }

      
    }

    public static class Helper
    {
        private static ReportSettings _setting;

        public static void InitHelper(ReportSettings setting)
        {
            _setting = setting;
        }

        public static object ConvertEpochToLocalTime(long? epoch, string? format = null)
        {
            if (epoch == null)
                return format != null ? "" : DateTime.MinValue;

            long epochValue = epoch.Value;

            // Detect milliseconds
            if (epochValue > 9999999999)
                epochValue /= 1000;

            // Convert epoch to UTC
            DateTime utcTime = DateTimeOffset.FromUnixTimeSeconds(epochValue).UtcDateTime;

            // Find timezone
            TimeZoneInfo timeZone;

            try
            {
                //if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                //{
                //    timeZone = TimeZoneInfo.FindSystemTimeZoneById(windowsId);
                //}
                //else
                //{
                //    timeZone = TimeZoneInfo.FindSystemTimeZoneById(linuxId);
                //}
                timeZone = TZConvert.GetTimeZoneInfo(_setting.TimeZoneId);
            }
            catch (TimeZoneNotFoundException)
            {
                Console.WriteLine("Time zone not found. Falling back to UTC.");
                timeZone = TimeZoneInfo.Utc;
            }

            // Convert to local
            DateTime localTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, timeZone);

            // Return based on whether format is specified
            return format != null
                ? localTime.ToString(format)
                : localTime;
        }


        public static string DisplayLastTest(long? testDate, string lastTestCv, string testClass)
        {
            string lastTest = string.Empty;
            //double yearsToAdd = 2.5;
            DateTime lastTestDate = DateTime.Now;

            lastTestDate = (DateTime)ConvertEpochToLocalTime(testDate);

            // Format month-year string
            lastTest += $"{testClass} " + lastTestDate.ToString("MM/yyyy");

            lastTest += lastTestCv == "2.5" ? " (A)" : " (H)";

            return lastTest.Trim();
        }

        public static string DisplayNextTest(long? testDate, string nextTestCv)
        {
            string nextTest = string.Empty;
            double yearsToAdd = 2.5;
            DateTime nextTestDate = DateTime.Now;

            nextTestDate = (DateTime)ConvertEpochToLocalTime(testDate);

            // Add 2.5 years (≈ 30 months)
            nextTestDate = nextTestDate.AddMonths((int)(yearsToAdd * 12));

            // Format month-year string
            nextTest += " " + nextTestDate.ToString("MM/yyyy");

            nextTest += nextTestCv == "2.5" ? " (A)" : " (H)";


            return nextTest.Trim();
        }

        public static string DisplayTankStatusInShort(string statusCodeValue)
        {
            if (string.IsNullOrWhiteSpace(statusCodeValue))
                return string.Empty;

            return statusCodeValue.ToUpperInvariant() switch
            {
                "SO_GENERATED" => "SO",
                "IN_GATE" => "IG",
                "IN_SURVEY" => "IS",
                "STEAM" => "SE",
                "RESIDUE" => "RE",
                "CLEANING" => "C",
                "REPAIR" => "R",
                "STORAGE" => "S",
                "RO_GENERATED" => "RO",
                "OUT_GATE" => "OG",
                "OUT_SURVEY" => "OS",
                "RELEASED" => "RL",
                _ => string.Empty
            };
        }

        public static long? GetAVDate(bool purposeStorage, bool purposeClean, bool purposeSteam, string purposeRepair,
                                        long? cleanCompleteDate, long? steamCompleteDate, long? repCompleteDate, long? eirInDate)
        {

            long? avDate = null;
            if (!string.IsNullOrEmpty(purposeRepair))
                avDate = repCompleteDate;
            else if (purposeClean)
                avDate = cleanCompleteDate;
            else if (purposeSteam)
                avDate = steamCompleteDate;
            else if (purposeStorage)
                avDate = eirInDate;
            return avDate;
        }

        public static string DisplayTankPurposeInShort(bool purposeStorage, bool purposeClean, bool purposeSteam, string purposeRepair)
        {
            var purposes = new List<string>();

            if (IsTrue(purposeStorage))
                purposes.Add("S");

            if (IsTrue(purposeClean))
                purposes.Add("C");

            if (IsTrue(purposeSteam))
                purposes.Add("SE");

            if (!string.IsNullOrWhiteSpace(purposeRepair))
                purposes.Add("R");

            return string.Join("; ", purposes);
        }


        // Helper to safely check nullable bools or truthy flags
        private static bool IsTrue(bool? value) => value.HasValue && value.Value;

    }

}
