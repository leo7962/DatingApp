﻿namespace DatingApp.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;

        public int PageSize
        {
            get => pageSize;
            set => pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        public int UserId { get; set; }
        public string Gender { get; set; }
        public int MingAge { get; set; } = 18;
        public int MaxAge { get; set; } = 99;
    }
}
