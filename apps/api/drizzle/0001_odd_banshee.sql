CREATE TYPE "public"."company_invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');--> statement-breakpoint
CREATE TABLE "company_invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"email" text NOT NULL,
	"role" "company_membership_role" DEFAULT 'COMPANY_USER' NOT NULL,
	"status" "company_invitation_status" DEFAULT 'PENDING' NOT NULL,
	"token" text NOT NULL,
	"invitedBy" text,
	"expiresAt" timestamp NOT NULL,
	"acceptedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_invitation" ADD CONSTRAINT "company_invitation_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_invitation" ADD CONSTRAINT "company_invitation_invitedBy_users_id_fk" FOREIGN KEY ("invitedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "company_invitation_company_email_pending_unique" ON "company_invitation" USING btree ("companyId","email") WHERE "company_invitation"."status" = $1;--> statement-breakpoint
CREATE UNIQUE INDEX "company_invitation_token_unique" ON "company_invitation" USING btree ("token");