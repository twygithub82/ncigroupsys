namespace DWMS.Models
{
    public class SampleEntityClass
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Identity_user
    {
        public string Id { get; set; }
        public string CorporateId {  get; set; }

        public bool isStaff { get; set; }

        public string UserName { get; set; }

        public string NormalizedUserName { get; set; }  

        public string Email { get; set; }

        public string NormalizedEmail { get; set; } 
    }
}
