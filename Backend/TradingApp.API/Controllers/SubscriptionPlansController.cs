using Microsoft.AspNetCore.Mvc;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.API.Controllers;

[ApiController]
[Route("api/plans")]
public class SubscriptionPlansController : ControllerBase
{
    private readonly ISubscriptionPlanRepository _repository;

    public SubscriptionPlansController(ISubscriptionPlanRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var plans = await _repository.GetAllAsync();
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var plan = await _repository.GetByIdAsync(id);
        if (plan == null) return NotFound();
        return Ok(plan);
    }

    // [Authorize(Roles = "admin")] // Uncomment when auth is fully rigorous
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SubscriptionPlan plan)
    {
        if (plan.Id == Guid.Empty) plan.Id = Guid.NewGuid();
        plan.CreatedAt = DateTime.UtcNow;
        
        await _repository.CreateAsync(plan);
        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
    }

    // [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SubscriptionPlan plan)
    {
        if (id != plan.Id) return BadRequest("ID mismatch");

        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();

        await _repository.UpdateAsync(plan);
        return NoContent();
    }

    // [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
