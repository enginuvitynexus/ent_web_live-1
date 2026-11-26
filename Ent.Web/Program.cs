using Ent.Web.Data;
using Ent.Web.Models;
using Ent.Web.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// Vercel passes a dynamic $PORT environment variable to containers.
// Read it at startup and override ASPNETCORE_URLS so Kestrel binds correctly.
// Falls back to 8080 for local Docker / OVH / any other platform.
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
Environment.SetEnvironmentVariable("ASPNETCORE_URLS", $"http://+:{port}");

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls($"http://+:{port}");

// Add Health Checks for Cloud Run probes
builder.Services.AddHealthChecks();

// Add services to the container.
// Connection string is overridden at runtime via environment variable:
// ConnectionStrings__DefaultConnection
var rawConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var connectionString = NormalizePostgresConnectionString(rawConnectionString);
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    // No database configured — register a no-op DbContext so DI doesn't break
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql("Host=localhost;Database=placeholder"));
}

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
});

// Configure Anti-Forgery
builder.Services.AddAntiforgery(options => 
{
    options.HeaderName = "X-CSRF-TOKEN";
});

// Bind and register email configuration
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, SmtpEmailService>();

builder.Services.AddRazorPages(options =>
{
    // Secure the Admin folder to require Administrator role
    options.Conventions.AuthorizeFolder("/Admin", "AdminOnly");
}).AddMvcOptions(options =>
{
    // Ensure all POST requests have Anti-Forgery validated automatically
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Administrator", "IT_Support", "Manager"));
});

var app = builder.Build();

// Seed Database
try
{
    await DatabaseSeeder.SeedAsync(app.Services);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Database migration/seeding failed. Continuing startup so the public website remains online.");
}


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
else 
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

// Map static assets
app.MapStaticAssets();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/healthz");

app.MapRazorPages()
   .WithStaticAssets();

app.Run();

static string? NormalizePostgresConnectionString(string? conn)
{
    if (string.IsNullOrWhiteSpace(conn))
        return conn;

    if (!conn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !conn.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        return conn;
    }

    var uri = new Uri(conn);
    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
    var database = uri.AbsolutePath.TrimStart('/');
    var dbPort = uri.Port > 0 ? uri.Port : 5432;

    var builder = new Npgsql.NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = dbPort,
        Database = database,
        Username = username,
        Password = password,
        SslMode = Npgsql.SslMode.Require
    };

    return builder.ConnectionString;
}
