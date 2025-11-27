namespace ONEHub.Worker.Configurations;

public interface IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration);
}
