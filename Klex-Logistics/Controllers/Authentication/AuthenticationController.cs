using System.Security.Claims;
using Klex_Logistics.Schema.UserSchema;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

public class AuthenticationHandle
{
    public static async Task<IActionResult> ApplyUserValidation(HttpContext context, UserSchema UserData, string userType)
    {
        if (UserData != null)
        {
            Console.WriteLine("Creating User Authentication");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, UserData.AccountName),
                new Claim("FullName", UserData.AccountName),
                new Claim(ClaimTypes.Role, userType)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                IsPersistent = true,
                IssuedUtc = DateTimeOffset.UtcNow,
                RedirectUri = "/Home"
            };

            await context.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties
            );

            var userName = context.User.Identity?.Name;
            var isAuthenticated = context.User.Identity?.IsAuthenticated;

            Console.WriteLine($"User {UserData.AccountName} logged in. Current user: {userName}, Authenticated: {isAuthenticated}");

            return new OkObjectResult(new { message = "Login Success!", UserData });
        }

        return new UnauthorizedObjectResult(new { message = "Invalid Credentials!", UserData });
    }

    public static async Task<IActionResult> RemoveUserValidation(HttpContext context, UserSchema UserData, string userType)
    {
        if (UserData != null)
        {
            Console.WriteLine("Removing Validation of level", userType);

            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            var userName = context.User.Identity?.Name;
            var isAuthenticated = context.User.Identity?.IsAuthenticated;

            Console.WriteLine($"User {UserData.AccountName} logged out. Current user: {userName}, Authenticated: {isAuthenticated}");

            return new OkObjectResult(new { message = "Logout Success!", UserData });
        }

        return new UnauthorizedObjectResult(new { message = "Invalid Credentials!", UserData });
    }
    public static async Task<IActionResult> VerifyUserValidation(HttpContext context, UserSchema UserData, string userType)
    {
        if (UserData != null)
        {
            Console.WriteLine("Verifying Validation of level", userType);

            await context.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            var userName = context.User.Identity?.Name;
            var isAuthenticated = context.User.Identity?.IsAuthenticated;

            Console.WriteLine($"User {UserData.AccountName} Verified. Current user: {userName}, Authenticated: {isAuthenticated}");

            return new OkObjectResult(new { message = "Logout Success!", UserData });
        }

        return new UnauthorizedObjectResult(new { message = "Invalid Credentials!", UserData }); 
    }
}
