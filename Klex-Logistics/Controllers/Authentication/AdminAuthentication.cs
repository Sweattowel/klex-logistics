using Klex_Logistics.Schema.UserSchema;
using Microsoft.AspNetCore.Mvc;

namespace Klex_Logistics.Controllers.User;

[ApiController]
[Route("AuthenticationAdministratorControl")]
public class AdminAuthentication : ControllerBase
{
    [HttpPost("HandleAdminLogin")]
    public async Task<IActionResult> HandleAdminLogin([FromBody] UserSchema body)
    {
        return await AuthenticationHandle.ApplyUserValidation(HttpContext, body, "Administrator");
    }
    [HttpPost("HandleAdminLogout")]
    public async Task<IActionResult> HandleAdminLogout([FromBody] UserSchema body)
    {
        return await AuthenticationHandle.RemoveUserValidation(HttpContext, body, "Administrator");
    }
    [HttpPost("HandleVerifyAdmin")]
    public async Task<IActionResult> HandleAdminVerify([FromBody] UserSchema body)
    {
        return await AuthenticationHandle.VerifyUserValidation(HttpContext, body, "Administrator");
    }
}