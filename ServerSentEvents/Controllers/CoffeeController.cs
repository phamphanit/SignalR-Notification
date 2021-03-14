using System;
using System.Threading;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serilog;
using WiredBrain.Helpers;
using WiredBrain.Models;

namespace WiredBrain.Controllers
{
    [Route("[controller]")]
    public class CoffeeController : Controller
    {
        private readonly OrderChecker _orderChecker;
        private readonly ILogger<CoffeeController> logger;

        public CoffeeController(OrderChecker orderChecker, ILogger<CoffeeController> logger)
        {
            _orderChecker = orderChecker;
            this.logger = logger;
        }

        [HttpPost]
        public IActionResult OrderCoffee(Order order)
        {
            logger.LogInformation("OrderCoffee start");

            //Start process for order
            return Accepted(1); //return order id 1
        }

        [HttpGet("{orderNo}")]
        public async void GetUpdateForOrder(int orderNo)
        {
            Response.ContentType = "text/event-stream";
            CheckResult result;
            logger.LogInformation("GetUpdateForOrder start");

            do
            {
                logger.LogInformation("Start event");
                result = _orderChecker.GetUpdate(orderNo);
                Thread.Sleep(3000);
                if (!result.New) continue;
                logger.LogInformation("New detected");

                await HttpContext.Response.WriteAsync(result.Update);
                await HttpContext.Response.Body.FlushAsync();
            } while (!result.Finished);

            Response.Body.Close();
        }
    }
}
