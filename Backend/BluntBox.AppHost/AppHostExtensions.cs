using System;
using BluntBox.Application.Interfaces;
using BluntBox.Application.Services;
using BluntBox.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BluntBox.AppHost
{
    public static class AppHostExtensions
    {
        public static IServiceCollection AddAppHostServices(this IServiceCollection services)
        {
            // Application services
            services.AddScoped<IMessageService, MessageService>();
                services.AddScoped<BluntBox.Application.Interfaces.INotificationService, BluntBox.Application.Services.NotificationService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IAiPromptService, AiPromptService>();
            services.AddScoped<BluntBox.Core.Interfaces.IUserService, BluntBox.Application.Services.UserService>();

            // Moderation queue and background processing
            services.AddSingleton<BluntBox.Application.Interfaces.IMessageModerationQueue, BluntBox.Application.Services.MessageModerationQueue>();
            services.AddHostedService<BluntBox.Application.Services.ModerationBackgroundService>();

            // Http client for OpenAI
            services.AddHttpClient("OpenAI");

            return services;
        }

        public static IServiceCollection AddAppDb(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<BluntBoxDbContext>(opt => opt.UseSqlServer(connectionString));
            return services;
        }
    }
}
