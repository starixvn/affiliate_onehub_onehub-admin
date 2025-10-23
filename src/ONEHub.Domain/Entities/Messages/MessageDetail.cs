namespace ONEHub.Domain.Entities.Messages;

public class MessageDetail
{
    public int MessageId { get; set; }
    public bool Important { get; set; }
    public string MessageEnglish { get; set; } = string.Empty;
    public string MessageIndonesian { get; set; } = string.Empty;
    public string MessageKorean { get; set; } = string.Empty;
    public string MessageThai { get; set; } = string.Empty;
    public string MessageVietnamese { get; set; } = string.Empty;
    public string MessageChinese { get; set; } = string.Empty;
}

