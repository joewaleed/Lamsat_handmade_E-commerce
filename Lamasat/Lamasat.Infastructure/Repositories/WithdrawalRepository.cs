using Lamasat.Application.Interfaces;
using Lamasat.Infastructure;
using Lamasat.Infastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lamasat.Infrastructure.Repositories
{
    public class WithdrawalRepository : GenericRepository<Withdrawal>, IWithdrawalRepository
    {
        public WithdrawalRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Withdrawal>> GetWithdrawalsByStatusAsync(string status)
        {
            return await _dbSet.Where(w => w.Status == status).ToListAsync();
        }

        public async Task UpdateStatusAsync(int withdrawalId, string newStatus)
        {
            var withdrawal = await _dbSet.FindAsync(withdrawalId);
            if (withdrawal != null)
            {
                withdrawal.Status = newStatus;
                Update(withdrawal);
            }
        }
    }
}
