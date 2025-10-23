using FluentValidation;
using ONEHub.Application.Auth.Commands;

namespace ONEHub.Application.Auth.Validators;

public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required");

        RuleFor(x => x.IpAddress)
            .NotEmpty().WithMessage("IP Address is required");
    }
}

