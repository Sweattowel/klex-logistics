using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Klex_Logistics.Controllers.UserData;

[ApiController]
[Route("UserData")]
[Authorize("User,Administrator,SuperAdministrator")]

public class UserData
{
    [HttpGet("UserData=${UserID}/EnergyYear=${WantedYear}")]
    public int GetYearData(int UserID, int WantedYear) 
    {
        return UserID;
    }
    [HttpGet("UserData=${UserID}/PlanID=${PlanID}")]
    public int GetPlanData(int UserID, int PlanID) 
    {
        return UserID;
    }
    [HttpGet("UserData=${UserID}")]
    public int GetUserData(int UserID) 
    {
        return UserID;
    }
}