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
    public class SellerRepository : GenericRepository<Seller>, ISellerRepository
    {
        public SellerRepository(AppDbContext context) : base(context) { }

        public async Task<Seller?> GetSellerWithWithdrawalsAsync(int sellerId)
        {
            return await _context.Sellers
                .Include(s => s.Withdrawals) 
                .FirstOrDefaultAsync(s => s.SellerId == sellerId);
        }

        public async Task<decimal> GetTotalEarningsAsync(int sellerId)
        {
            var seller = await _context.Sellers.FindAsync(sellerId);
            return seller?.Balance ?? 0;
        }

        public async Task<IEnumerable<Withdrawal>> GetPendingWithdrawalsAsync(int sellerId)
        {
            return await _context.Withdrawals
                .Where(w => w.SellerId == sellerId && w.Status == "Pending")
                .ToListAsync();
        }
    }
}
