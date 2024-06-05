using DWMS.Cleaning.Model;
using DWMS.DB.Implementation;
using DWMS.DB.Interface;
using DWMS.DBAccess;
using DWMS.DBAccess.Interface;
using Microsoft.Extensions.DependencyInjection;

namespace DWMS.Cleaning.GqlTypes
{
    public class QueryType
    {
        //private readonly IServiceProvider _serviceProvider;

        //public QueryType(IServiceProvider serviceProvider)
        //{

        //}


        //public QueryType(IServiceProvider service)
        //{
        //    //_mySqlDb = mySqlDb;
        //    _serviceProvider = service;
        //    var db = _serviceProvider.GetRequiredService<DBAccessService>();
        //}

        public Book AllBooks()
        {
            return new Book
            {
                Title = "C# in depth.",
                Author = new Author
                {
                    Name = "Jon Skeet"
                }
            };
        }
    

        public Cake GiveMeCakes()
        {
            return new Cake
            {
                Description = "This is new cake for the month",
                Id = 001,
                Name = "April Cake",
                Price = 12
            };
        }

        public async Task<List<Person>> GetPerson(iDBAccess dBAccessService, iDatabase database)
        {
            var ret = await dBAccessService.GetAllDataAsync();
            return ret.ToList();
            //return null;
        }
    }
}
