using core.Domain.InterfaceRepository;
using core.Domain.Models;
using Core.Data.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Data.Repositories
{
	public class UserRepository : IUserRepository
	{
		#region Private Variables
		private CoreContext _coreContext;
		#endregion

		#region Context
		public UserRepository(CoreContext coreContext)
		{
			_coreContext = coreContext;
		}
		#endregion
		/// <summary>
		/// create new user (registration)
		/// </summary>
		/// <param name="user"></param>
		/// <returns></returns>
		public async Task<User> CreateUser(User user)
		{
			var result = _coreContext.Users.Add(user);
			await _coreContext.SaveChangesAsync();
			return user;
		}
		/// <summary>
		/// check if there is a user with enter credentials
		/// </summary>
		/// <param name="email"></param>
		/// <param name="password"></param>
		/// <returns></returns>
		public async Task<User> CheckUser(string email, string password)
		{
			return await _coreContext.Users.Where(x => x.Email.ToLower() == email.ToLower() && x.Password.ToLower() == password.ToLower()).FirstOrDefaultAsync();
		}

		/// <summary>
		/// get user by identifier
		/// </summary>
		/// <param name="identifier"></param>
		/// <returns></returns>
		public async Task<User> GetUserByIdentifier(Guid identifier)
		{
			return await _coreContext.Users.Where(x => x.UserIdentifier == identifier).FirstOrDefaultAsync();
		}
		/// <summary>
		/// get user by email
		/// </summary>
		/// <param name="email"></param>
		/// <returns></returns>
		public async Task<User> GetUserByEmail(string email)
		{
			return await _coreContext.Users.Where(x => x.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
		}
		/// <summary>
		/// update user
		/// </summary>
		/// <param name="name"></param>
		/// <param name="user"></param>
		/// <returns></returns>
		public async Task<User> UpdateUserAccountDetails(Guid identifier, User model)
		{
			var user = await _coreContext.Users.FirstOrDefaultAsync(x => x.UserIdentifier == identifier);
			if (user == null)
				return null;
			user.Name = model.Name;
			user.Surname = model.Surname;
			user.Email = model.Email;
			user.CellPhone = model.CellPhone;
			user.UpdatedAt = DateTime.UtcNow;
			var result = await _coreContext.SaveChangesAsync();
			return user;
		}

		/// <summary>
		/// update user
		/// </summary>
		/// <param name="password"></param>
		/// <param name="identifier"></param>
		/// <returns></returns>
		public async Task<User> UpdatePassword(Guid identifier, string password)
		{
			var user = await _coreContext.Users.FirstOrDefaultAsync(x => x.UserIdentifier == identifier);
			if (user == null)
				return null;
			user.Password = password;
			user.UpdatedAt = DateTime.UtcNow;
			var result = await _coreContext.SaveChangesAsync();
			return user;
		}

		/// <summary>
		/// Update Settings
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		public async Task<Settings> UpdateSettings(Settings model)
		{
			var settings = await _coreContext.Settings.FirstOrDefaultAsync(x => x.UserIdentifier == model.UserIdentifier);
			if (settings == null)
				return null;
			settings.FontSize = model.FontSize;
			settings.Contrast = model.Contrast;
			settings.UpdatedAt = DateTime.UtcNow;
			var result = await _coreContext.SaveChangesAsync();
			return settings;
		}
		/// <summary>
		/// Create Settings
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		public async Task<Settings> CreateSettings(Settings model)
		{
			var result = _coreContext.Settings.Add(model);
			await _coreContext.SaveChangesAsync();
			return model;
		}
		/// <summary>
		/// get settings by identifier
		/// </summary>
		/// <param name="identifier"></param>
		/// <returns></returns>
		public async Task<Settings> GetSettingsByIdentifier(Guid identifier)
		{
			return await _coreContext.Settings.Where(x => x.UserIdentifier == identifier).FirstOrDefaultAsync();
		}
		/// <summary>
		/// get user by cellphone
		/// </summary>
		/// <param name="email"></param>
		/// <returns></returns>
		public async Task<User> GetUserByCellPhone(int cellphone)
		{
			return await _coreContext.Users.Where(x => x.CellPhone == cellphone).FirstOrDefaultAsync();
		}

		/// <summary>
		/// get user by cellphone or email
		/// </summary>
		/// <param name="email"></param>
		/// <param name="cellphone"></param>
		/// <returns></returns>
		public async Task<User> GetUserByCellPhoneOrEmail(int cellphone, string email)
		{
			return await _coreContext.Users.Where(x => x.CellPhone == cellphone ||  x.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
		}
	}
}
