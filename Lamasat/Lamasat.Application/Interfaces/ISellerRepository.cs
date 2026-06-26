using Lamasat.Infastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lamasat.Application.Interfaces
{
    public interface ISellerRepository : IGenericRepository<Seller>
    {
        Task<Seller?> GetSellerWithWithdrawalsAsync(int sellerId);
        Task<decimal> GetTotalEarningsAsync(int sellerId);
        Task<IEnumerable<Withdrawal>> GetPendingWithdrawalsAsync(int sellerId);
    }
}
