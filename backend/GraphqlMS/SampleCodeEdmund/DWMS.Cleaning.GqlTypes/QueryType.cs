using DWMS.Cleaning.Model;

namespace DWMS.Cleaning.GqlTypes
{
    public class QueryType
    {
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
    }
}
