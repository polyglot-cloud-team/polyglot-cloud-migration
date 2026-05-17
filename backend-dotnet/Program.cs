var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyHeader()
          .AllowAnyMethod());

app.MapGet("/api/status", () =>
{
    return Results.Json(new
    {
        message = "Backend Running Successfully V1"
    });
});

app.Run();