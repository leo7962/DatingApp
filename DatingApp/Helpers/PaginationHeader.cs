namespace DatingApp.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }

        public PaginationHeader(int currentPage, int itemsPerpage, int totalItems, int totalPages)
        {
            CurrentPage = currentPage;
            ItemsPerPage = itemsPerpage;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }
    }
}