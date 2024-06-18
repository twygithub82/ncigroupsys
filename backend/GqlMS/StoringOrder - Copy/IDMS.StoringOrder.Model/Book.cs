using HotChocolate;

namespace IDMS.StoringOrder.Model
{
    public class Book
    {
        [GraphQLName("Book Title")]
        public string Title { get; set; }

        public Author Author { get; set; }
    }

    public class Author
    {
        public string Name { get; set; }
    }
}
