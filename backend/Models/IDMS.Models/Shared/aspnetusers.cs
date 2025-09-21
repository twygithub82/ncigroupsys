using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Linq;
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
        public IEnumerable<user_role?>? user_role { get; set; }

        [UseFiltering]
        public IEnumerable<team_user?>? team_user { get; set; }

        [UseFiltering]
        public IEnumerable<user_functions?>? user_functions { get; set; }

    }

    public class aspnetroles
    {
        [Key]
        public string? Id { get; set; }
        [GraphQLName("Role")]
        public string? Name { get; set; }

        [UseFiltering]
        public IEnumerable<aspnetuserroles?>? aspnetuserroles { get; set; }
    }

    [PrimaryKey("userID", "roleID")]
    public class aspnetuserroles
    {
        public string userID { get; set; }
        public string roleID { get; set; }

        [UseFiltering]
        public aspnetusers? aspnetusers { get; set; }
        [UseFiltering]
        public aspnetroles? aspnetroles { get; set; }
    }
}
