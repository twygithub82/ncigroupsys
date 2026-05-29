using AutoMapper;
using IDMS.Customer.GqlTypes.LocalModel;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Shared;

namespace IDMS.Master.Application
{
    public class MapperProfile: Profile
    {
        public MapperProfile()
        {
            //CreateMap<InGateSurveyRequest, in_gate_survey>()
            //.ForMember(dest => dest.guid, opt => opt.Ignore());

            // Add this line to bridge the gap
            CreateMap<CustomerRequest, customer_company>();
        }
    }
}
