using System;
using System.ServiceModel.Activation;
using System.Web;
using System.Web.Routing;

namespace FatCatChat.Service
{
    public class Global : HttpApplication
    {
        protected void Application_AuthenticateRequest(object sender, EventArgs e) {}

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            EnableCrossDomainSupport();
        }

        protected void Application_End(object sender, EventArgs e) {}

        protected void Application_Error(object sender, EventArgs e) {}

        protected void Application_Start(object sender, EventArgs e)
        {
            StartRestService();
        }

        protected void Session_End(object sender, EventArgs e) {}

        protected void Session_Start(object sender, EventArgs e) {}

        private static void EnableCrossDomainSupport()
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");

            if (HttpContext.Current.Request.HttpMethod != "OPTIONS") return;

            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
            HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
            HttpContext.Current.Response.End();
        }

        private static void StartRestService()
        {
            RouteTable.Routes.Add(new ServiceRoute("", new WebServiceHostFactory(), typeof(RestService)));
        }
    }
}