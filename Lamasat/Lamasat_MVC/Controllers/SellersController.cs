using Lamasat.Application.Interfaces;
using Lamasat.Infastructure;
using Microsoft.AspNetCore.Mvc;

namespace Lamasat.API.Controllers
{
    public class SellersController : BaseApiController
    {
        private readonly ISellerRepository _sellerRepo;

        public SellersController(ISellerRepository sellerRepo)
        {
            _sellerRepo = sellerRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSellers()
        {
            var sellers = await _sellerRepo.GetAllAsync();
            return HandleResult(sellers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSellerById(int id)
        {
            var seller = await _sellerRepo.GetByIdAsync(id);
            if (seller == null)
                return HandleError("Seller not found");
            return HandleResult(seller);
        }

        [HttpGet("{id}/withdrawals")]
        public async Task<IActionResult> GetSellerWithdrawals(int id)
        {
            var sellerWithWithdrawals = await _sellerRepo.GetSellerWithWithdrawalsAsync(id);
            if (sellerWithWithdrawals == null)
                return HandleError("Seller not found");
            return HandleResult(sellerWithWithdrawals.Withdrawals);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeller([FromBody] Seller seller)
        {
            if (!ModelState.IsValid)
                return HandleError("Invalid data");

            await _sellerRepo.AddAsync(seller);
            await _sellerRepo.SaveChangesAsync();
            return HandleResult(seller, "Seller created successfully");
        }
    }
}