using Microsoft.AspNetCore.Http;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;
using System.Security.Claims;
using System.Text.Json;

namespace ONEHub.Infrastructure.Services;

public class SessionService : ISessionService
{
    private const string UserPermissionSessionKey = "__UserPermissionSessionKey";
    private const string ClaimSessionKey = "_Claim12BSessionKey";
    private const string UserIdKey = "__CustID";
    private const string OnUserIDKey = "__OnUserIDKey";
    private const string AffNameKey = "AffName";

    private readonly IHttpContextAccessor _httpContextAccessor;

    public SessionService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ISession? Session => _httpContextAccessor.HttpContext?.Session;

    public int UserId
    {
        get => Session?.GetInt32(UserIdKey) ?? 0;
        set => Session?.SetInt32(UserIdKey, value);
    }

    public int OnUserId
    {
        get => Session?.GetInt32(OnUserIDKey) ?? 0;
        set => Session?.SetInt32(OnUserIDKey, value);
    }

    public string AffName
    {
        get => Session?.GetString(AffNameKey) ?? string.Empty;
        set
        {
            if (Session != null)
                Session.SetString(AffNameKey, value);
        }
    }

    public IList<UserPermission> UserPermissionList
    {
        get
        {
            var json = Session?.GetString(UserPermissionSessionKey);
            if (string.IsNullOrEmpty(json))
                return new List<UserPermission>();

            try
            {
                return JsonSerializer.Deserialize<List<UserPermission>>(json) ?? new List<UserPermission>();
            }
            catch
            {
                return new List<UserPermission>();
            }
        }
        set
        {
            if (Session != null)
            {
                var json = JsonSerializer.Serialize(value);
                Session.SetString(UserPermissionSessionKey, json);
            }
        }
    }

    public IEnumerable<ClaimsIdentity> ClaimIdentities
    {
        get
        {
            var json = Session?.GetString(ClaimSessionKey);
            if (string.IsNullOrEmpty(json))
                return Enumerable.Empty<ClaimsIdentity>();

            try
            {
                var claims = JsonSerializer.Deserialize<List<SerializableClaimsIdentity>>(json);
                return claims?.Select(c => c.ToClaimsIdentity()) ?? Enumerable.Empty<ClaimsIdentity>();
            }
            catch
            {
                return Enumerable.Empty<ClaimsIdentity>();
            }
        }
        set
        {
            if (Session != null)
            {
                var serializableClaims = value.Select(c => new SerializableClaimsIdentity(c)).ToList();
                var json = JsonSerializer.Serialize(serializableClaims);
                Session.SetString(ClaimSessionKey, json);
            }
        }
    }

    public ClaimsPrincipal? UserClaim => _httpContextAccessor.HttpContext?.User;

    public bool HasHostPermission(string functionName)
    {
        return UserPermissionList.Any(i =>
            string.Equals(i.FunctionName, functionName, StringComparison.OrdinalIgnoreCase) && i.IsHost);
    }

    private class SerializableClaimsIdentity
    {
        public string? AuthenticationType { get; set; }
        public List<SerializableClaim> Claims { get; set; } = new();

        public SerializableClaimsIdentity() { }

        public SerializableClaimsIdentity(ClaimsIdentity identity)
        {
            AuthenticationType = identity.AuthenticationType;
            Claims = identity.Claims.Select(c => new SerializableClaim(c)).ToList();
        }

        public ClaimsIdentity ToClaimsIdentity()
        {
            var identity = new ClaimsIdentity(AuthenticationType);
            foreach (var claim in Claims)
            {
                identity.AddClaim(claim.ToClaim());
            }
            return identity;
        }
    }

    private class SerializableClaim
    {
        public string Type { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? ValueType { get; set; }

        public SerializableClaim() { }

        public SerializableClaim(Claim claim)
        {
            Type = claim.Type;
            Value = claim.Value;
            ValueType = claim.ValueType;
        }

        public Claim ToClaim()
        {
            return new Claim(Type, Value, ValueType ?? ClaimValueTypes.String);
        }
    }
}


