using System;
using System.IO;
using FileUploadWebApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace FileUploadWebApi.Controllers
{
    [Route("api/[Controller]")]
    public class FileUploadController : Controller
    {
       const string FILE_PATH = @"C:\Users\Kwintowski\Desktop\Career\Projects\FlyingDonkeyIT\FileUpload\";

       [HttpPost]
       public IActionResult Post([FromBody]FileToUpload theFile) {
         var filePathName = FILE_PATH + 
           Path.GetFileNameWithoutExtension(theFile.FileName) + "-" +
           DateTime.Now.ToString().Replace("/", "")
           .Replace(":", "").Replace(" ", "") +
           Path.GetExtension(theFile.FileName);

           if(theFile.FileAsBase64.Contains(","))
           {
               theFile.FileAsBase64 = theFile.FileAsBase64.Substring(theFile.FileAsBase64.IndexOf(",") + 1);
           }

           theFile.FileAsByteArray = Convert.FromBase64String(theFile.FileAsBase64);

            using (var fs = new FileStream(filePathName,FileMode.CreateNew)) {
                fs.Write(theFile.FileAsByteArray, 0, theFile.FileAsByteArray.Length);
            }

           return Ok();
       } 
    }
}