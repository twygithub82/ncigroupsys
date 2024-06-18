using GraphQL.Types;
using System.Reflection.Metadata;

namespace Dot6.HotChoc12.CRUD.Demo.Data.Entities;


public class Cake
{
    public int Id{get;set;}
    public string Name{get;set;}

    public decimal Price {get; set;}

    public string Description{get;set;}

    public List<shape> Shape { get; set; }
}

public class shape
{
    public int Id {get;set;}
    public int no { get; set; }
    public int lines { get; set; }
    public Cake? cake { get; set; }
}
