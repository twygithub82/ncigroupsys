namespace DWMS.User.Authentication.API.Models.Authentication
{

    public class AssignRolesTeams : RolesTeams
    {
        public string UserName { get; set; }
    }

    public class RolesTeams
    {
        public List<string>? Roles { get; set; }
        public List<Team>? Teams { get; set; }
    }

    public class Team
    {
        public string? Name { get; set; } = string.Empty;
        public string? Department {  get; set; }=string.Empty;
}
