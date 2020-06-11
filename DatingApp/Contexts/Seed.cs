using DatingApp.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace DatingApp.Contexts
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any())
            {
                string userData = System.IO.File.ReadAllText("Contexts/UserSeedData.json");
                List<User> users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (User user in users)
                {
                    CreatePasswordHash("password", out byte[] passwordhash, out byte[] passwordSalt);

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
            using (System.Security.Cryptography.HMACSHA512 hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}