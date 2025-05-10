using Klex_Logistics.Schema.UserSchema;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;

namespace Klex_Logistics.Controllers.User;

[ApiController]
[Route("AuthenticationUserControl")]
public class UserAuthentication : ControllerBase
{
    [HttpPost("HandleUserLogin")]
    public async Task<IActionResult> HandleUserLogin([FromBody] UserSchema body)
    {
        return await AuthenticationHandle.ApplyUserValidation(HttpContext, body, "User");
    }
    [HttpPost("HandleUserLogout")]
    public async Task<IActionResult> HandleLogout([FromBody] UserSchema body)
    {
        return await AuthenticationHandle.RemoveUserValidation(HttpContext, body, "User");
    }
    [HttpPost("HandleVerifyUser")]
    public async Task<IActionResult> HandleUserVerify([FromBody] UserSchema body)
    {
        return await AuthenticationHandle.VerifyUserValidation(HttpContext, body, "User");
    }

};