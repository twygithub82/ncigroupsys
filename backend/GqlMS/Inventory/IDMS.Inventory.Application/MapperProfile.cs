using AutoMapper;
using IDMS.Models.Inventory;
using IDMS.Models.Shared;
using IDMS.StoringOrder.GqlTypes.LocalModel;
using IDMS.Survey.GqlTypes.LocalModel;

namespace IDMS.Inventory.Application
{
    public class MapperProfile: Profile
    {
        public MapperProfile()
        {
            //CreateMap<InGateSurveyRequest, in_gate_survey>()
            //.ForMember(dest => dest.guid, opt => opt.Ignore());

            CreateMap<InGateSurveyRequest, in_gate_survey>(MemberList.Source)
            .ForMember(d => d.guid, o => o.Ignore());

            CreateMap<OutGateSurveyRequest, out_gate_survey>(MemberList.Source)
            .ForMember(dest => dest.guid, opt => opt.Ignore());

            CreateMap<StoringOrderTankRequest, storing_order_tank>(MemberList.Source);
            CreateMap<StoringOrderRequest, storing_order>(MemberList.Source);

            CreateMap<tank_info, tank_info>(MemberList.Source)
                .ForMember(dest => dest.storing_order_tank, opt => opt.Ignore())
                .ForMember(dest => dest.guid, opt => opt.Ignore())
                .ForMember(dest => dest.create_dt, opt => opt.Ignore())
                .ForMember(dest => dest.create_by, opt => opt.Ignore());
        }
    }
}
