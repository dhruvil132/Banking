namespace api.Infrastructure
{
	public interface IMailService
	{
		Task<bool> SendOTPForForgotPassword(string reciepient, string message);

	}
}
