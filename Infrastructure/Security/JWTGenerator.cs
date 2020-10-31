using Application.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Infrastructure.Security
{
    public class JWTGenerator : IJWTGenerator
    {
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId,)
            }
        }
    }
}
