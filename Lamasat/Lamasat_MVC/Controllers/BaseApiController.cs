using Microsoft.AspNetCore.Mvc;

namespace Lamasat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        protected IActionResult HandleResult(object? result, string message = "Success")
        {
            // تحقق جيد من أن النتيجة ليست null، لأن إرجاع null في Ok يعتبر ممارسة غير جيدة
            if (result == null)
            {
                return NotFound(new { Success = false, Message = "Data not found" });
            }

            return Ok(new { Success = true, Message = message, Data = result });
        }

        protected IActionResult HandleError(string message = "An error occurred")
        {
            return BadRequest(new { Success = false, Message = message });
        }
    }
}