using HotChocolate;
using IDMS.Models.Master;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class aspnetusers
    {
        [Key]
        [IsProjected]
        public string? Id { get; set; }
        public int? CorporateID { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        //[UseFiltering]
        //public IEnumerable<aspnetuserroles?>? aspnetuserroles { get; set; }

        [UseFiltering]
        public virtual IEnumerable<user_role?>? user_role { get; set; }

        [UseFiltering]
        public virtual IEnumerable<team_user?>? team_user { get; set; }

        [UseFiltering]
        public virtual IEnumerable<user_functions?>? user_functions { get; set; }

        [UseFiltering]
        public virtual IEnumerable<user_customer?>? user_customer { get; set; }

    }

    public class aspnetroles
    {
        [Key]
        public string? Id { get; set; }
        [GraphQLName("Role")]
        public string? Name { get; set; }

        [UseFiltering]
        public virtual IEnumerable<aspnetuserroles?>? aspnetuserroles { get; set; }
    }

    [PrimaryKey("userID", "roleID")]
    public class aspnetuserroles
    {
        public string userID { get; set; }
        public string roleID { get; set; }

        [UseFiltering]
        public virtual aspnetusers? aspnetusers { get; set; }
        [UseFiltering]
        public virtual aspnetroles? aspnetroles { get; set; }
    }

    public class user_customer : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("user")]
        //[UseFiltering]
        public string? user_id { get; set; }

        [ForeignKey("customer_company")]
        //[UseFiltering]
        public string? customer_company_guid { get; set; }

        public virtual aspnetusers? user { get; set; }
        public virtual customer_company? customer_company { get; set; }

    }
}
