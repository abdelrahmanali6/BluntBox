using System.Text;
using BluntBox.AppHost;
using BluntBox.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// SignalR for notifications
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();

// Register SignalR notification publisher implementation (will be used by application services)
builder.Services.AddSingleton<BluntBox.Application.Interfaces.INotificationPublisher, BluntBox.Api.SignalR.SignalRNotificationPublisher>();

// Register Swagger with JWT Bearer auth so the Authorize button is available
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// AppHost registrations
builder.Services.AddAppHostServices();

var conn = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not set.");
builder.Services.AddAppDb(conn);

var jwtKey = builder.Configuration["Jwt:Key"] ?? "super_secret_jwt_key_change_this";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "BluntBox";
var audience = builder.Configuration["Jwt:Audience"] ?? "BluntBoxUsers";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

var app = builder.Build();

// Always enable Developer Exception Page and Swagger UI for easy testing in local/workspace envs
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map SignalR hub
app.MapHub<BluntBox.Api.SignalR.NotificationHub>("/hubs/notifications");

// (registered earlier)

app.Run();
