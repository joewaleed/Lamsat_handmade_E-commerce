using Microsoft.AspNetCore.Mvc;
using Lamasat.Application.Interfaces;

namespace Lamasat.API.Controllers
{
    public class WithdrawalsController : BaseApiController
    {
        private readonly IWithdrawalRepository _withdrawalRepo;

        public WithdrawalsController(IWithdrawalRepository withdrawalRepo)
        {
            _withdrawalRepo = withdrawalRepo;
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetWithdrawalsByStatus(string status)
        {
            var withdrawals = await _withdrawalRepo.GetWithdrawalsByStatusAsync(status);
            return HandleResult(withdrawals);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateWithdrawalStatus(int id, [FromBody] string newStatus)
        {
            var exists = await _withdrawalRepo.ExistsAsync(w => w.WithdrawalId == id);
            if (!exists)
                return HandleError("Withdrawal not found");

            await _withdrawalRepo.UpdateStatusAsync(id, newStatus);
            await _withdrawalRepo.SaveChangesAsync();
            return HandleResult(null, "Status updated successfully");
        }
    }
}