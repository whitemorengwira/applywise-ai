"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { SEED_PROFILE, SEED_EXPERIENCES, SEED_SKILLS, SEED_EDUCATIONS } from "@/lib/db/seed-data";

export default function ProfilePage() {
  const [profile] = React.useState(SEED_PROFILE);
  const [experiences] = React.useState(SEED_EXPERIENCES);
  const [skills] = React.useState(SEED_SKILLS);
  const [educations] = React.useState(SEED_EDUCATIONS);

  return (
    <AppShell pageTitle="Candidate Profile & Verified Evidence">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30 font-bold text-xl font-mono shadow-[0_0_20px_rgba(14,165,233,0.25)]">
              NW
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {profile.fullName}
                </h2>
                <Badge variant="success" className="gap-1 font-mono text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  VERIFIED CANDIDATE
                </Badge>
                <Badge variant="default" className="font-mono text-xs">
                  {profile.seniorityLevel} Level
                </Badge>
              </div>
              <p className="text-sm font-medium text-primary">
                {profile.headline}
              </p>
              <p className="text-xs text-foreground-muted flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-foreground-subtle" />
                {profile.location} • {profile.yearsExperience}+ Years Production Experience
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://nwhite.systems/" target="_blank" rel="noreferrer" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Portfolio Review
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/whitemorengwira" target="_blank" rel="noreferrer" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Executive Summary & Architectural Focus
          </h4>
          <p className="text-xs md:text-sm text-foreground leading-relaxed">
            {profile.summary}
          </p>
        </div>

        {/* Target Preferences Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/60">
          <div>
            <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
              Target Titles
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.targetTitles.slice(0, 3).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded bg-secondary/60 text-foreground-muted border border-border/50">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
              Preferred Work Mode
            </span>
            <p className="text-xs text-foreground mt-1 font-medium">
              Remote (Global) or Hybrid London
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
              Target Compensation
            </span>
            <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
              £{profile.targetSalaryMin?.toLocaleString()} - £{profile.targetSalaryMax?.toLocaleString()} GBP
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Experience on Left, Skills & Credentials on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Experience Timeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Verified Career Milestones & Production Architectures
          </h3>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <Card key={exp.id} className="border-border/80 bg-card/70 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <h4 className="font-bold text-base text-foreground">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-primary font-medium">
                      {exp.company} • <span className="text-foreground-subtle">{exp.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground-subtle font-mono">
                    <Calendar className="h-3.5 w-3.5 text-foreground-subtle" />
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>

                <p className="text-xs text-foreground-muted italic">
                  {exp.summary}
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
                    Demonstrated Impact & Verified Artifacts
                  </span>
                  <ul className="space-y-2">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
                  <span className="text-[11px] text-foreground-subtle mr-1">Technologies:</span>
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary/80 text-foreground-muted border border-border/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills & Education Sidebar (1 Col) */}
        <div className="space-y-6">
          {/* Skills Matrix */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              Skills & Proficiencies
            </h3>
            <Card className="border-border/80 bg-card/70 p-5 space-y-4">
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between text-xs pb-2 border-b border-border/40 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="font-medium text-foreground">{skill.name}</span>
                    </div>
                    <Badge variant={skill.proficiency === "Expert" ? "success" : "default"} className="text-[10px] font-mono">
                      {skill.proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Academic Credentials
            </h3>
            <Card className="border-border/80 bg-card/70 p-5 space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-1 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                  <h5 className="text-xs font-semibold text-foreground">{edu.degree}</h5>
                  <p className="text-xs text-primary">{edu.institution}</p>
                  <p className="text-[11px] text-foreground-subtle">{edu.fieldOfStudy}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
