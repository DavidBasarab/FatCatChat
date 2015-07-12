using System;
using System.Web;

namespace FatCatChat.Echo
{
    public class Global : HttpApplication
    {
        protected void Application_AuthenticateRequest(object sender, EventArgs e) {}

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            Context.Response.AppendHeader("Access-Control-Allow-Credentials", "true");
            var referrer = Request.UrlReferrer;
            if (Context.Request.Path.Contains("signalr/") && referrer != null) Context.Response.AppendHeader("Access-Control-Allow-Origin", referrer.Scheme + "://" + referrer.Authority);
        }

        protected void Application_End(object sender, EventArgs e) {}

        protected void Application_Error(object sender, EventArgs e) {}

        protected void Application_Start(object sender, EventArgs e) {}

        protected void Session_End(object sender, EventArgs e) {}

        protected void Session_Start(object sender, EventArgs e) {}
    }
}