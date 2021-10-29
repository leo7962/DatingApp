using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.DTO;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly Cloudinary _cloudinary;

        public PhotosController(IDatingRepository datingRepository, IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            var acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret);

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _datingRepository.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }


        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var userFromRepo = await _datingRepository.GetUser(userId);

            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.Name, stream),
                    Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                };

                uploadResult = _cloudinary.Upload(uploadParams);
            }

            photoForCreationDto.Url = uploadResult.Url.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if (!userFromRepo.Photos.Any(u => u.IsMain)) photo.IsMain = true;

            userFromRepo.Photos.Add(photo);

            if (await _datingRepository.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, photoToReturn);
            }

            return BadRequest("No se pudo agregar la foto");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var user = await _datingRepository.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id)) return Unauthorized();

            var photoFromRepo = await _datingRepository.GetPhoto(id);

            if (photoFromRepo.IsMain) return BadRequest("Esta es la foto principal");

            var currentMainPhoto = await _datingRepository.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if (await _datingRepository.SaveAll()) return NoContent();

            return BadRequest("Esta foto no pudo ser la principal");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var user = await _datingRepository.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id)) return Unauthorized();

            var photoFromRepo = await _datingRepository.GetPhoto(id);

            if (photoFromRepo.IsMain) return BadRequest("Esta foto principal no puede ser eliminada");

            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);

                var result = await _cloudinary.DestroyAsync(deleteParams);

                if (result.Result == "ok") _datingRepository.Delete(photoFromRepo);
            }

            if (photoFromRepo.PublicId == null) _datingRepository.Delete(photoFromRepo);

            if (await _datingRepository.SaveAll()) return Ok();

            return BadRequest("Ha fallado al eliminar la foto");
        }
    }
}