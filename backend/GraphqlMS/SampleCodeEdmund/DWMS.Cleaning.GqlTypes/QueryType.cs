using DWMS.Cleaning.Model;
using HotChocolate;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using System.Net;
using CommonUtil.Core.Service;
using DWMS.DBAccess.Interface;

namespace DWMS.Cleaning.GqlTypes
{
    public class QueryType
    {
        private readonly IDBAccess _dbAccess;

        public QueryType([Service] IDBAccess dBAccess)
        {
            _dbAccess = dBAccess;
        }

        /// <summary>
        /// This is actual db access function
        /// </summary>
        /// <returns></returns>
        public async Task<List<Person>> GetAllPersons()
        {
            var persons = await _dbAccess.GetAllDataAsync();
            return persons.ToList();
        }

        public async Task<Person> GetPersonById(int id)
        {
            var persons = await _dbAccess.GetDataByIdAsync(id);
            if (persons == null)
            {
                throw new GraphQLException(new Error("person not found", "NOT_FOUND"));
            }
            return persons;
        }

        /// <summary>
        /// This is dummy data test function
        /// </summary>
        /// <returns></returns>
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

        /// <summary>
        /// This is dummy data test function
        /// </summary>
        /// <returns></returns>
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
    }
}
