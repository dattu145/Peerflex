# Database Migration Instructions

The Supabase region was temporarily unavailable during setup. When it becomes available, run the database migration to create all the necessary tables for the Student Super-App features.

## Migration File Location

The migration SQL is ready to be applied. It includes:

### Tables Created:
1. **notes** - For notes sharing feature
2. **note_likes** - For liking notes
3. **conversations** - For chat feature
4. **conversation_participants** - For managing chat participants
5. **messages** - For storing chat messages
6. **job_listings** - For job opportunities
7. **job_applications** - For tracking job applications
8. **events** - For events and hangouts
9. **event_participants** - For event registrations
10. **opensource_projects** - For open source project listings
11. **project_contributors** - For project contributors

### Security:
- All tables have Row Level Security (RLS) enabled
- Proper policies for authenticated users
- Indexes for better query performance

## How to Apply:

Once Supabase is available, the migration can be applied through the Supabase MCP tools that are already configured in this project.

## Features Summary:

### 1. Notes Sharing (`/notes`)
- Share study notes with other students
- Public/private visibility control
- Tags and subjects for organization
- Like and view tracking

### 2. Student Chat (`/chat`)
- Direct messaging between students
- Group chat functionality
- Real-time message delivery
- Read receipts

### 3. Job Listings (`/jobs`)
- Browse internships and jobs
- Auto-apply integration ready (n8n)
- Filter by job type, skills, location
- Application tracking

### 4. Events & Hangouts (`/events`)
- Create and join events
- Workshop, study groups, hackathons
- Virtual and in-person events
- Participant limits and tracking

### 5. Open Source Projects (`/projects`)
- Discover student-led projects
- Contribute to open source
- Filter by difficulty and tech stack
- Track contributions

### 6. Resume Builder (existing + enhanced)
- Professional resume templates
- AI-powered suggestions
- Portfolio integration
