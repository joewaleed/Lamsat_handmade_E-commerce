using Lamasat.Infastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lamasat.Application.Interfaces
{
    public interface IWithdrawalRepository : IGenericRepository<Withdrawal>
    {
        Task<IEnumerable<Withdrawal>> GetWithdrawalsByStatusAsync(string status);
        Task UpdateStatusAsync(int withdrawalId, string newStatus);
    }
}
