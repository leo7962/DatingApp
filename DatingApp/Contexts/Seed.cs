using DatingApp.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace DatingApp.Contexts
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any())
            {
                var userData = File.ReadAllText("Contexts/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (var user in users)
                {
                    CreatePasswordHash("password", out var passwordhash, out var passwordSalt);

                    user.PasswordHash = passwordhash;
                    user.PasswordSalt = passwordSalt;
                    user.Username = user.Username.ToLower();
                    context.Users.Add(user);
                }

                context.SaveChanges();
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}