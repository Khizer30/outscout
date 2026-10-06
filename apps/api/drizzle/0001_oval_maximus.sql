ALTER TYPE "public"."lead_status" ADD VALUE 'COMPLETED';--> statement-breakpoint
ALTER TYPE "public"."lead_status" ADD VALUE 'ARCHIVED';--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "completedBy" text;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_completedBy_users_id_fk" FOREIGN KEY ("completedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;