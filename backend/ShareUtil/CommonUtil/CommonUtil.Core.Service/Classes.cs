using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonUtil.Core.Service
{
    public class JTokenVisitor
    {
        public void Visit(JToken token)
        {
            if (token.Type == JTokenType.Object)
            {
                VisitObject(token.Value<JObject>());
            }
            else if (token.Type == JTokenType.Array)
            {
                VisitArray(token.Value<JArray>());
            }
        }

        private void VisitObject(JObject obj)
        {
            foreach (JProperty property in obj.Properties())
            {
                if (property.Value.Type == JTokenType.String)
                {
                    string value = property.Value.Value<string>();
                    if (IsBase64String(value) && value.Length > 300)
                    {
                        property.Value = "{this is a base64 string}";
                    }
                }
                else
                {
                    Visit(property.Value);
                }
            }
        }

        //private void VisitArray(JArray array)
        //{
        //    foreach (JToken token in array)
        //    {
        //        Visit(token);
        //    }
        //}
        private void VisitArray(JArray array)
        {
            for (int i = 0; i < array.Count; i++)
            {
                if (array[i].Type == JTokenType.String)
                {
                    string text = array[i].Value<string>();
                    if (IsBase64String(text) && text.Length > 300)
                    {
                        array[i] = "{this is a base64 string}";
                    }
                }
                else
                {
                    Visit(array[i]);
                }
            }
        }

        public bool IsBase64String(string input)
        {
            try
            {
                Convert.FromBase64String(input);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}
