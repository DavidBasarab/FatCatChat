using Microsoft.AspNet.SignalR;

namespace FatCatChat.Echo
{
    public class ChatHub : Hub
    {
        public void NextMessage(string something, string somethingElse, string andAnOther)
        {
            Clients.All.aNewMessage(something, somethingElse, andAnOther);
        }

        public void Send(string name, string message)
        {
            Clients.All.broadcastMessage(name, message);
        }
    }
}