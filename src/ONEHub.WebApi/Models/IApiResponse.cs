namespace ONEHub.WebApi.Models;

public interface IApiResponse<T> where T : class
{
    public int ErrorCode { get; set; }

    public string ErrorMessage { get; set; }

    public T Result { get; set; }
}

public interface IApiResponse
{
    public int ErrorCode { get; set; }

    public string ErrorMessage { get; set; }
}
