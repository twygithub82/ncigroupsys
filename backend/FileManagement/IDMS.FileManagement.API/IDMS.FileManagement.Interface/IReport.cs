using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface
{
    public interface IReport
    {
        public Task<bool> GenerateTankActivityReport();
    }
}
