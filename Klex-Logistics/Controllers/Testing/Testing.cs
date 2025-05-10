using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Klex_Logistics.Controllers.Testing;
[ApiController]
[Route("TestingRoutes")]
//[Authorize("User,Administrator,SuperAdministrator")]
public class Testing : ControllerBase
{
    [HttpGet("TestUserAccess")]
    [Authorize(Roles = "User")]
    public string TestUserAccess()
    {
        return "Success";
    }
    [HttpGet("TestAdministratorAccess")]
    [Authorize(Roles = "Administrator")]
    public string TestAdministratorAccess()
    {
        return "Success";
    }
    [HttpGet("TestSuperAdministratorAccess")]
    [Authorize(Roles = "SuperAdministrator")]
    public string TestSuperAdministratorAccess()
    {
        return "Success";
    }
}
