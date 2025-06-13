using Microsoft.EntityFrameworkCore;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<TodoContext>(opt =>
    opt.UseSqlite("Data Source=todos.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files (HTML, CSS, JavaScript) from wwwroot
app.UseDefaultFiles(); // This makes index.html the default file for /
app.UseStaticFiles();  // This serves other static files (like script.js)

app.UseCors("AllowAll"); // Keep CORS if you still want to allow external clients

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();