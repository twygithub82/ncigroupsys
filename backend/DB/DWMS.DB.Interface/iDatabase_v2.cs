using Newtonsoft.Json.Linq;

namespace DWMS.DB.Interface
{
    public interface iDatabase_v2
    {
       
       public Task <int> ExecuteNonQueryCommand(string command);
       public Task <List<JToken>> QueryData(string query);
       public Task<int> RunStoredProcedure(string name, Parameter[] parameters);
      
    }

  
    public class Parameter
    {
        public string Name { get; set; }
        public object Value { get; set; }
    }
}
