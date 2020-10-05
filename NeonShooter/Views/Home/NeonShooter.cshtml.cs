using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeonShooter.Views.Home
{
    public class NeonShooter
    {
        UserManager<IdentityUser> UserManager;
        SignInManager<IdentityUser> SignInManager;
    }
}
