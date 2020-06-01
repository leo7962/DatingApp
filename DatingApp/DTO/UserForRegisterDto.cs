using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.DTO
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength =4, ErrorMessage ="Debe ingresar una contraseña entre 4 y 8 caracteres")]
        public string Password { get; set; }
    }
}
