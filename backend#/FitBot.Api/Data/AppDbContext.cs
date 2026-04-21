using FitBot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FitBot.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<ChatMessage> ChatHistory { get; set; }
        public DbSet<BmiLog> BmiLogs { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<Synonym> Synonyms { get; set; }
        public DbSet<StopWord> StopWords { get; set; }
        public DbSet<ReferenceMotion> ReferenceMotions { get; set; }
        public DbSet<VideoMotionPattern> VideoMotionPatterns { get; set; }
        public DbSet<ChatHistory> ChatHistories { get; set; }
        public DbSet<DeepMemory> DeepMemories { get; set; }
        public DbSet<DietPlan> DietPlans { get; set; }
        public DbSet<ExercisePlan> ExercisePlans { get; set; }
        public DbSet<LikedVideo> LikedVideos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - Profile one-to-one relation
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId);

            // Unique constraint: one memory key per user
            modelBuilder.Entity<DeepMemory>()
                .HasIndex(m => new { m.UserId, m.MemoryKey })
                .IsUnique();

            // Unique constraint: one like per video per user
            modelBuilder.Entity<LikedVideo>()
                .HasIndex(v => new { v.UserId, v.VideoId })
                .IsUnique();

            // Default values for DateTime columns
            modelBuilder.Entity<ChatHistory>()
                .Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<DeepMemory>()
                .Property(d => d.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<DietPlan>()
                .Property(d => d.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<ExercisePlan>()
                .Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<LikedVideo>()
                .Property(l => l.LikedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}