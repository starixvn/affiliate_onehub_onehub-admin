using FluentValidation;
using ONEHub.Application.Affiliates.Commands;

namespace ONEHub.Application.Affiliates.Validators;

public class ApproveAffiliateCommandValidator : AbstractValidator<ApproveAffiliateCommand>
{
    public ApproveAffiliateCommandValidator()
    {
        RuleFor(x => x.AffiliateId)
            .GreaterThan(0)
            .WithMessage("Affiliate ID must be greater than 0");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters");

        RuleFor(x => x.Status)
            .NotEmpty()
            .WithMessage("Status is required");

        RuleFor(x => x.UserId)
            .GreaterThan(0)
            .WithMessage("User ID is required");
    }
}

