using System.ComponentModel;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace FatCatChat.Service
{
    [ServiceContract]
    public interface IRestService
    {
        [OperationContract]
        [WebGet(UriTemplate = "TestHookUp", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        [Description("This will test the hook up of the service")]
        Stream TestHookUp();
    }
}