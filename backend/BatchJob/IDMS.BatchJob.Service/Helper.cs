using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.BatchJob.Service
{
    public class JTokenEqualityComparer : IEqualityComparer<JToken>
    {
        public bool Equals(JToken x, JToken y)
        {
            if (x == null || y == null)
                return x == y;

            // Compare JObject instances using JToken.DeepEquals
            return JToken.DeepEquals(x, y);
        }

        public int GetHashCode(JToken obj)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            // Generate hash code based on the string representation of the JObject
            return obj.ToString().GetHashCode();
        }
    }
}
