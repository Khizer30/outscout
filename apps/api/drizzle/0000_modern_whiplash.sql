CREATE TYPE "public"."audit_action" AS ENUM('USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'COMPANY_CREATED', 'COMPANY_UPDATED', 'COMPANY_DELETED', 'EMAIL_SETTINGS_UPDATED', 'RULE_CREATED', 'RULE_UPDATED', 'RULE_DELETED');--> statement-breakpoint
CREATE TYPE "public"."company_invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'REVOKED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."company_membership_role" AS ENUM('COMPANY_ADMIN', 'COMPANY_USER');--> statement-breakpoint
CREATE TYPE "public"."company_membership_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."message_channel" AS ENUM('WHATSAPP', 'EMAIL');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('ENRICHING', 'READY', 'CONTACTED', 'INTERESTED', 'UNRESPONSIVE', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."lead_type" AS ENUM('SOFTWARE_COMPANY', 'ADVERTISING_AGENCY', 'MARKETING_AGENCY', 'RESTAURANT', 'HOTEL', 'HOSPITAL', 'DENTAL_CLINIC', 'REAL_ESTATE_AGENCY', 'LAW_FIRM', 'ACCOUNTING', 'GYM', 'BEAUTY_SALON');--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('VERIFY', 'RESET');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actorId" text,
	"companyId" text,
	"action" "audit_action" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"about" text,
	"companyImageURL" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "company_email_settings" (
	"companyId" text PRIMARY KEY NOT NULL,
	"brevoApiKeyCipher" text,
	"fromEmail" text,
	"emailSignature" text,
	"primaryColor" text,
	"secondaryColor" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "company_membership" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"userId" text NOT NULL,
	"role" "company_membership_role" DEFAULT 'COMPANY_USER' NOT NULL,
	"status" "company_membership_status" DEFAULT 'ACTIVE' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_message_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"channel" "message_channel" NOT NULL,
	"rules" text,
	"greeting" text,
	"version" integer DEFAULT 1 NOT NULL,
	"updatedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_message_rules_history" (
	"id" text PRIMARY KEY NOT NULL,
	"companyMessageRulesId" text NOT NULL,
	"companyId" text NOT NULL,
	"channel" "message_channel" NOT NULL,
	"version" integer NOT NULL,
	"rules" text,
	"greeting" text,
	"changedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"status" "lead_status" DEFAULT 'ENRICHING' NOT NULL,
	"name" text,
	"description" text,
	"address" text,
	"latitude" double precision,
	"longitude" double precision,
	"phone" text,
	"website" text,
	"businessStatus" text,
	"rating" double precision,
	"userRatingCount" integer,
	"primaryType" "lead_type",
	"types" "lead_type"[] DEFAULT '{}' NOT NULL,
	"emails" text[] DEFAULT '{}' NOT NULL,
	"otherPhones" text[] DEFAULT '{}' NOT NULL,
	"socialLinks" jsonb DEFAULT '{"otherLinks":[]}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"refreshTokenHash" text NOT NULL,
	"ipAddress" text NOT NULL,
	"expiryTime" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"isSuperAdmin" boolean DEFAULT false NOT NULL,
	"profileImageURL" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" "verification_type" NOT NULL,
	"otp" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_users_id_fk" FOREIGN KEY ("actorId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_email_settings" ADD CONSTRAINT "company_email_settings_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_invitation" ADD CONSTRAINT "company_invitation_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_invitation" ADD CONSTRAINT "company_invitation_invitedBy_users_id_fk" FOREIGN KEY ("invitedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_membership" ADD CONSTRAINT "company_membership_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_membership" ADD CONSTRAINT "company_membership_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_message_rules" ADD CONSTRAINT "company_message_rules_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_message_rules" ADD CONSTRAINT "company_message_rules_updatedBy_users_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_message_rules_history" ADD CONSTRAINT "company_message_rules_history_companyMessageRulesId_company_message_rules_id_fk" FOREIGN KEY ("companyMessageRulesId") REFERENCES "public"."company_message_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_message_rules_history" ADD CONSTRAINT "company_message_rules_history_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actorId");--> statement-breakpoint
CREATE INDEX "audit_logs_company_id_idx" ON "audit_logs" USING btree ("companyId");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("createdAt");--> statement-breakpoint
CREATE UNIQUE INDEX "company_invitation_company_email_pending_unique" ON "company_invitation" USING btree ("companyId","email") WHERE "company_invitation"."status" = 'PENDING';--> statement-breakpoint
CREATE UNIQUE INDEX "company_invitation_token_unique" ON "company_invitation" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "company_membership_company_user_unique" ON "company_membership" USING btree ("companyId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX "company_message_rules_company_channel_unique" ON "company_message_rules" USING btree ("companyId","channel");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessions_refresh_token_hash_idx" ON "sessions" USING btree ("refreshTokenHash");--> statement-breakpoint
CREATE INDEX "sessions_expiry_time_idx" ON "sessions" USING btree ("expiryTime");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_active_unique" ON "users" USING btree ("email") WHERE "users"."deletedAt" is null;--> statement-breakpoint
CREATE INDEX "verifications_user_id_idx" ON "verifications" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verifications_otp_idx" ON "verifications" USING btree ("otp");--> statement-breakpoint
CREATE INDEX "verifications_expires_at_idx" ON "verifications" USING btree ("expiresAt");--> statement-breakpoint
CREATE INDEX "verifications_used_idx" ON "verifications" USING btree ("used");