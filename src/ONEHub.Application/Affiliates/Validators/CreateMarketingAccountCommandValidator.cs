using FluentValidation;
using ONEHub.Application.Affiliates.Commands;

namespace ONEHub.Application.Affiliates.Validators;

public class CreateMarketingAccountCommandValidator : AbstractValidator<CreateMarketingAccountCommand>
{
    public CreateMarketingAccountCommandValidator()
    {
        RuleFor(x => x.AffiliateType)
            .GreaterThan(0).WithMessage("Affiliate type is required");

        RuleFor(x => x.GroupId)
            .GreaterThan(0).WithMessage("Group is required");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(200).WithMessage("Email cannot exceed 200 characters");

        RuleFor(x => x.PreferredLanguage)
            .NotEmpty().WithMessage("Preferred language is required");

        RuleFor(x => x.PreferredPayment)
            .NotEmpty().WithMessage("Preferred payment method is required");

        RuleFor(x => x.TargetCountryCode)
            .NotEmpty().WithMessage("Target country is required")
            .MaximumLength(10).WithMessage("Country code cannot exceed 10 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");

        RuleFor(x => x.PlayerUsername)
            .MaximumLength(50).WithMessage("Player username cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.PlayerUsername));
    }
}

