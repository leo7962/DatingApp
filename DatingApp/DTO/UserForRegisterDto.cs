using System.ComponentModel.DataAnnotations;

namespace DatingApp.DTO
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Debe ingresar una contraseña entre 4 y 8 caracteres")]
        public string Password { get; set; }
    }
}
