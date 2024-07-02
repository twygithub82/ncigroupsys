using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using System;
using System.Net;
using IDMS.Booking.GqlTypes.Repo;
using IDMS.Models.Inventory;
using HotChocolate.Execution.Processing;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace IDMS.Booking.GqlTypes
{
    public class BookingMutation
    {
        //public async Task<int> CreateStoringOrder(SOType so, List<SOTType> soTanks,
        //    AppDbContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
        //{
        //    try
        //    {
        //        string user = "admin";
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        storing_order soDomain = new();
        //        mapper.Map(so, soDomain);
        //        soDomain.guid = Util.GenerateGUID();
        //        soDomain.create_dt = currentDateTime;
        //        soDomain.create_by = user;

        //        if (soTanks is null || soTanks.Count <= 0)
        //            throw new GraphQLException(new Error("Storing order tank cannot be null or empty.", "INVALID_RECORD"));

        //        foreach (var tnk in soTanks)
        //        {
        //            storing_order_tank newTank = mapper.Map<SOTType, storing_order_tank>(tnk);
        //            newTank.guid = soDomain.guid;
        //            newTank.create_dt = currentDateTime;
        //            newTank.create_by = user;
        //            soDomain.storing_order_tank.Append(newTank);
        //        }

        //        // Add StoringOrder to DbContext and save changes
        //        context.storing_order.Add(soDomain);
        //        var res = await context.SaveChangesAsync();

        //        //TODO
        //        //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
        //        return res;
        //    }
        //    catch(Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
        //    }
        //}

        //public async Task<int> UpdateStoringOrder(SOType so, List<SOTType> soTanks,
        //    AppDbContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
        //{
        //    //id updateSO dont have guid i need to call insert command
        //    //for soTanks, if have guid and delete_dt > 1 need to call update (soft delete)
        //    //return null;
        //    try
        //    {
        //        //if updateSO have guid then i need call update command
        //        storing_order? soDomain = await context.storing_order.Where(d => d.delete_dt == null)
        //                                .Include(s => s.storing_order_tank)
        //                                .FirstOrDefaultAsync(s => s.guid == so.guid);
        //        if (soDomain == null)
        //        {
        //            throw new GraphQLException(new Error("Storing Order not found.", "NOT_FOUND"));
        //        }

        //        string user = "admin";
        //        long currentDateTime = DateTime.Now.ToEpochTime();


        //        // Update child entities (StoringOrderTanks)
        //        foreach (var tnk in soTanks)
        //        {
        //            // Find the corresponding existing child entity or add a new one if necessary
        //            var existingTank = soDomain.storing_order_tank.FirstOrDefault(t => t.guid == tnk.guid);
        //            if (existingTank == null)
        //            {
        //                //For Insert
        //                // If the child entity does not exist, add a new one
        //                storing_order_tank newTank = mapper.Map<SOTType, storing_order_tank>(tnk);
        //                newTank.guid = Util.GenerateGUID(); // Ensure the foreign key is set
        //                newTank.create_dt = currentDateTime;
        //                newTank.create_by = user;
        //                context.storing_order_tank.Add(newTank);
        //                continue;
        //            }

        //            //var updatedTank = RemoveNullProperties(tnk);
        //            mapper.Map(tnk, existingTank);
        //            if (tnk.delete_dt > 0)
        //            {
        //                existingTank.delete_dt = currentDateTime;
        //                existingTank.update_dt = currentDateTime;
        //                existingTank.update_by = user;
        //            }
        //            else
        //            {
        //                //For Update
        //                //existingTank = updatedTank;
        //                existingTank.update_dt = currentDateTime;
        //                existingTank.update_by = user;
        //                //existingTank.clean_status = tnk.clean_status;
        //                //existingTank.certificate = tnk.certificate;
        //            }
        //        }

        //        //List<storing_order_tank> storingOrderTanks = new();
        //        //foreach (var sot in soTanks)
        //        //{
        //        //    storing_order_tank tank = mapper.Map<SOT_type, storing_order_tank>(sot);
        //        //    if (string.IsNullOrEmpty(sot.guid))
        //        //    {
        //        //        //For Insert
        //        //        //tank = mapper.Map<SOT_type, storing_order_tank>(sot);
        //        //        tank.guid = Util.GenerateGUID();
        //        //        tank.create_dt = currentDateTime;
        //        //        tank.create_by = user;
        //        //    }

        //        //    if (sot.delete_dt > 1)
        //        //    {
        //        //        //For delete
        //        //        tank.delete_dt = currentDateTime;
        //        //        tank.update_dt = currentDateTime;
        //        //        tank.update_by = user;
        //        //    }
        //        //    else
        //        //    {
        //        //        //For Update
        //        //        //tank = mapper.Map<SOT_type, storing_order_tank>(sot);
        //        //        tank.update_dt = currentDateTime;
        //        //        tank.update_by = user;
        //        //    }
        //        //    storingOrderTanks.Add(tank);
        //        //}

        //        if(so.delete_dt > 0)
        //        {
        //            soDomain.delete_dt = currentDateTime;
        //            soDomain.update_dt = currentDateTime;
        //            soDomain.update_by = user;
        //        }
        //        else
        //        {
        //            soDomain.status_cv = so.status_cv;
        //            soDomain.contact_person = so.contact_person;
        //            soDomain.customer_company_guid = so.customer_company_guid;
        //            soDomain.haulier = so.haulier;
        //            soDomain.so_no = so.so_no;
        //            soDomain.so_notes = so.so_notes;
        //            soDomain.update_dt = currentDateTime;
        //            soDomain.update_by = user;
        //        }

        //        //soDomain.storing_order_tank = storingOrderTanks;
        //        context.storing_order.Update(soDomain);
        //        var res = await context.SaveChangesAsync();

        //        //TODO
        //        //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
        //        //await topicEventSender.SendAsync(updateCourseTopic, course);
        //        return res;
        //    }
        //    catch(Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
        //    }
        //}
    }
}
