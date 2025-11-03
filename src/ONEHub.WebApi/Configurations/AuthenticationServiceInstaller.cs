using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ONEHub.Domain.Settings;

namespace ONEHub.WebApi.Configurations;

public class AuthenticationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var jwtSetting = configuration.GetSection(JwtSetting.SettingName).Get<JwtSetting>();

        ArgumentNullException.ThrowIfNull(jwtSetting);

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSetting.Issuer,
                    ValidAudience = jwtSetting.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSetting.SecretKey)),
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.TryGetValue("accessToken", out var token))
                        {
                            context.Token = token;
                        }
                        else if (!string.IsNullOrEmpty(context.Request.Headers.Authorization))
                        {
                            context.Token = context.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                        }
                        else
                        {
                            context.Token = null;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();
    }
}
