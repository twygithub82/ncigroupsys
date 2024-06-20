using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB
{
    public class ApplicationParameterDBContext : DbContext
    {
        public ApplicationParameterDBContext(DbContextOptions<ApplicationParameterDBContext> options):base(options) 
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EntityClass_CleaningGroupWithCleanProcedure>()
                .HasMany(e => e.clean_procedures)
                .WithOne(t => t.clean_group)
                .HasForeignKey(t => t.clean_group_guid);


            modelBuilder.Entity<EntityClass_CleaningProcedureSteps>()
                .HasOne(e=>e.clean_step)
                .WithMany(t => t.clean_procedures)
                .HasForeignKey(t=>t.cleaning_step_guid);

            modelBuilder.Entity<EntityClass_CleaningProcedureSteps>()
               .HasOne(e => e.clean_procedure)
               .WithMany(t => t.clean_steps)
               .HasForeignKey(t => t.cleaning_procedure_guid);

            //modelBuilder.Entity<EntityClass_CleaningGroupWithCleanProcedure>()
            //    .HasKey(t => t.guid);

            //modelBuilder.Entity<EntityClass_CleaningProcedure>()
            //    .HasKey(e => e.guid);

            //modelBuilder.Entity<EntityClass_CleaningStep>()
            //    .HasKey(e => e.guid);

        }

        public DbSet<IDMS.Models.Parameter.EntityClass_CleaningGroupWithCleanProcedure> cleaning_group { get; set; }
        public DbSet<IDMS.Models.Parameter.EntityClass_CleaningProcedureWithSteps> cleaning_procedure { get; set; }

        public DbSet<IDMS.Models.Parameter.EntityClass_CleaningStep> cleaning_steps { get; set; }

        public DbSet<IDMS.Models.Parameter.EntityClass_CleaningProcedureSteps> cleaning_procedure_steps { get; set; }


    }
}
