using Microsoft.AspNetCore.Mvc;

namespace Lamsat.Controllers {
        // You should secure this with [Authorize(Roles = "Admin")]
    public class DashboardController : Controller {
        public IActionResult Index() {

            return View();
        }
    }
}