using System;
using System.IO;
using System.Net;
using System.ServiceModel.Web;

namespace FatCatChat.Service
{
    public class RestService : IRestService
    {
        public void SetContentToJson()
        {
            if (WebOperationContext.Current == null) return;

            WebOperationContext.Current.OutgoingResponse.Headers[HttpResponseHeader.ContentType] = "application/json";
            WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Json;
            WebOperationContext.Current.OutgoingResponse.StatusCode = HttpStatusCode.OK;
        }

        public Stream TestHookUp()
        {
            return ProcessJsonReturnRequest(() => "Yes this works".ToStream());
        }

        private Stream HandleError(Exception ex)
        {
            WebOperationContext.Current.OutgoingResponse.StatusCode = HttpStatusCode.InternalServerError;

            return "ERROR".ToStream();
        }

        private Stream ProcessJsonReturnRequest(Func<Stream> requestProcess)
        {
            SetContentToJson();

            try
            {
                return requestProcess();
            }
            catch (Exception ex)
            {
                return HandleError(ex);
            }
        }
    }
}