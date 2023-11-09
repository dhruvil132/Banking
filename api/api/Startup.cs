#region Usings
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using core.Domain.InterfaceRepository;
using core.Data.Repositories;
using Core.Data.Context;
using api.Infrastructure;
#endregion

namespace banking_system_api
{
	public class Startup
	{
		readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}
		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddCors(options =>
			{
				options.AddPolicy("CorsPolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
			});


			var key = Encoding.ASCII.GetBytes("THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING");
			services.AddAuthentication(x =>
			{
				x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(x =>
			{
				x.RequireHttpsMetadata = false;
				x.SaveToken = true;
				x.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(key),
					ValidateIssuer = false,
					ValidateAudience = false
				};
			});
			services.AddMemoryCache();
			DependancyResolving(services);
			SetGmailCredentials();
			services.AddControllers();
			services.AddAuthorization();
			services.AddDbContext<CoreContext>(opt =>
					opt.UseSqlServer(Configuration.GetConnectionString("Default")));
			CoreContext.conStr = Configuration.GetConnectionString("Default");
			services.AddHttpClient();

		}
		private void SetGmailCredentials()
		{
			MailService.Username = Configuration.GetSection("Gmail:Username").Value;
			MailService.Password = Configuration.GetSection("Gmail:Password").Value;
			MailService.SMTPPort = Configuration.GetSection("Gmail:SMTPPort").Value;
			MailService.SMTPServer = Configuration.GetSection("Gmail:SMTPServer").Value;
		}

		private void DependancyResolving(IServiceCollection services)
		{
			services.AddDbContext<CoreContext>(opt =>
				  opt.UseSqlServer(Configuration.GetConnectionString("Default")));

				services.AddTransient<IUserRepository, UserRepository>();
			services.AddTransient<IMailService, MailService>();
			services.AddTransient<IAccountRepository, AccountRepository>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			app.UseCors("CorsPolicy");
			app.UseHttpsRedirection();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
