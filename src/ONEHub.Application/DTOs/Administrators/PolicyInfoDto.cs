namespace ONEHub.Application.DTOs.Administrators
{
    public class PolicyInfoDto
    {
        public int ParentId { get; set; }
        public int Policy { get; set; }
        public int FuncId { get; set; }
        public string FuncDesc { get; set; } = string.Empty;
        public byte GPolicy { get; set; }
    }
}
