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
        public IEnumerable<aspnetuserroles?>? aspnetuserroles { get; set; }
    }

    public class aspnetroles
    {
        [Key]
        public string? Id { get; set; }
        [GraphQLName("Role")]
        public string? Name { get; set; }

        public IEnumerable<aspnetuserroles?>? aspnetuserroles { get; set; }
    }

    [PrimaryKey("userID", "roleID")]
    public class aspnetuserroles
    {
        public string userID { get; set; }
        public string roleID { get; set; }

        public aspnetusers? aspnetusers { get; set; }
        public aspnetroles? aspnetroles { get; set; }
    }
}
