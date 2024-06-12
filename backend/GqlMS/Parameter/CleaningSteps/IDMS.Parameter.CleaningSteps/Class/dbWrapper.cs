using CommonUtil.Core.Service;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;

namespace IDMS.Parameter.CleaningSteps.Class
{
    public class dbWrapper
    {

        public static async Task<string> GetJWTKey(string urlQueryApi)
        {
            string secretkey = "";
            try
            {
                var sqlStatement = JsonConvert.SerializeObject( "select * from param_values where param_val_type='JWT_SECRET_KEY'");
                var (status, resultstring) = await Util.RestCallAsync(urlQueryApi, HttpMethod.Post, sqlStatement);
                if(status==System.Net.HttpStatusCode.OK)
                {
                    var result = JToken.Parse(resultstring);
                    if(result["result"]?.Count() == 0)
                    {
                        return secretkey;
                    }

                    secretkey = $"{result["result"][0]["param_val"]}";
                }
                
            }
            catch {
                throw;
            }

            return secretkey;


        }
    }
}
