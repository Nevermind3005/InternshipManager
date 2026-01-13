using server.Data;
using server.Foundation.Result;
using server.Models.InternshipDocument;

namespace server.Services;

public interface IInternshipDocumentService
{
    Task<Result<InternshipDocumentsStatusResDto>> GetDocumentsStatusAsync(Guid internshipId, Guid userId);
    Task<Result<InternshipDocumentResDto>> UploadDocumentAsync(Guid internshipId, Guid userId, EDocumentSlot slot, Stream fileStream, string fileName);
    Task<Result<(Stream FileStream, string FileName, string ContentType)>> DownloadDocumentAsync(Guid internshipId, Guid documentId, Guid userId);
    Task<Result> DeleteDocumentAsync(Guid internshipId, Guid documentId, Guid userId);
    Task<Result> ApproveDocumentsAsync(Guid internshipId, Guid userId);
    Task<Result> RejectDocumentsAsync(Guid internshipId, Guid userId);
}
