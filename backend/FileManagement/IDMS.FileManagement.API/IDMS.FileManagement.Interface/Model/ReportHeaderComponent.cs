using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace IDMS.FileManagement.Interface.Model
{
    public class ReportSettings
    {
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyRegistration { get; set; } = string.Empty;
        public string CompanyAddress { get; set; } = string.Empty;
        public string CompanyContact { get; set; } = string.Empty;
        public string LogoPath { get; set; } = string.Empty;
        public int HeaderNameFontSize { get; set; } = 9;
        public int ReportTitleFontSize { get; set; } = 14;
        public int SubTitleFontSize { get; set; } = 9;
        public bool ShowSubtitle { get; set; } = false;
        public bool SaveFile { get; set; } = false;
        public string TimeZoneId {  get; set; } = "Singapore Standard Time";
        //public string TimeZoneId_Linux { get; set; } = "Asia/Singapore";
    }


    public class ReportHeaderComponent : IComponent
    {

        private readonly ReportSettings _settings;
        private readonly string _reportTitle;
        private readonly string? _subTitleText;
        private readonly string? _webRootPath;

        public ReportHeaderComponent(string reportTitle, ReportSettings settings, string webRootPath, string? subTitleText = null)
        {
            _settings = settings;
            _reportTitle = reportTitle;
            _subTitleText = subTitleText;
            _webRootPath = webRootPath;
        }

        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                // Header Row: Left = Company Info | Right = Logo
                column.Item().Row(row =>
                {
                    // LEFT SIDE: Company Details
                    row.RelativeItem().PaddingTop(15).Column(col =>
                    {
                        col.Item().Text(_settings.CompanyName).FontSize(_settings.HeaderNameFontSize);
                        col.Item().Text(_settings.CompanyRegistration).FontSize(_settings.HeaderNameFontSize);
                        col.Item().Text(_settings.CompanyAddress).FontSize(_settings.HeaderNameFontSize);
                        col.Item().Text(_settings.CompanyContact).FontSize(_settings.HeaderNameFontSize);
                    });

                    // RIGHT SIDE: Logo
                    if (!string.IsNullOrEmpty(_settings.LogoPath))
                    {
                        var fullPath = Path.Combine(_webRootPath, _settings.LogoPath);
                        row.ConstantItem(155)
                            .AlignRight()
                            .AlignMiddle()
                            .Image(fullPath)
                            .FitWidth();
                    }
                });

                // Divider line
                column.Item().PaddingTop(5).LineHorizontal(0.5f).LineColor(Colors.Grey.Medium);
                column.Item().PaddingTop(13);

                // Report Title
                column.Item()
                    .AlignCenter()
                    .AlignMiddle()
                    .Text(_reportTitle)
                    .FontSize(_settings.ReportTitleFontSize);

                // Optional Subtitle
                if (_settings.ShowSubtitle && !string.IsNullOrEmpty(_subTitleText))
                {
                    column.Item()
                        .PaddingTop(5)
                        .AlignCenter()
                        .Text(_subTitleText)
                        .FontSize(_settings.SubTitleFontSize);
                }
            });
        }
    }
}
