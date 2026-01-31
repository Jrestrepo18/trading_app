using Microsoft.AspNetCore.Mvc;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.API.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly INewsRepository _repository;

    public NewsController(INewsRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var news = await _repository.GetAllNewsAsync();
        return Ok(news);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NewsItem newsItem)
    {
        if (string.IsNullOrEmpty(newsItem.Id)) newsItem.Id = Guid.NewGuid().ToString();
        newsItem.SentAt = DateTime.UtcNow;
        
        await _repository.CreateNewsAsync(newsItem);
        return Ok(newsItem);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] NewsItem newsItem)
    {
        if (id != newsItem.Id) return BadRequest();
        await _repository.UpdateNewsAsync(newsItem);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _repository.DeleteNewsAsync(id);
        return NoContent();
    }
}
