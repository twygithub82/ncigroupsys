using HotChocolate.Data.Filters;
using IDMS.Models.Parameter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Filters
{
    public class parameter_cleaning_procedure_filtertype:FilterInputType<EntityClass_CleaningProcedureSteps>
    {
        protected override void Configure(IFilterInputTypeDescriptor<EntityClass_CleaningProcedureSteps> descriptor)
        {
            descriptor.Ignore(e => e.clean_procedure);
            base.Configure(descriptor);
        }
    }
}
