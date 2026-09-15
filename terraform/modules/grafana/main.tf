terraform {
  required_version = ">= 1.5.0"
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = "~> 3.0"
    }
  }
}

# 1. Folder for ApplyWise AI Dashboards
resource "grafana_folder" "applywise" {
  title = "${var.folder_name} (${title(var.environment)})"
}

# 2. Dashboard 1: Application Overview
resource "grafana_dashboard" "application_overview" {
  folder      = grafana_folder.applywise.uid
  config_json = file("${var.dashboards_dir}/01-application-overview.json")
}

# 3. Dashboard 2: AI Operations
resource "grafana_dashboard" "ai_operations" {
  folder      = grafana_folder.applywise.uid
  config_json = file("${var.dashboards_dir}/02-ai-operations.json")
}

# 4. Dashboard 3: Kubernetes Workloads
resource "grafana_dashboard" "kubernetes_workloads" {
  folder      = grafana_folder.applywise.uid
  config_json = file("${var.dashboards_dir}/03-kubernetes-workloads.json")
}

# 5. Dashboard 4: Database Storage
resource "grafana_dashboard" "database_storage" {
  folder      = grafana_folder.applywise.uid
  config_json = file("${var.dashboards_dir}/04-database-storage.json")
}

# 6. Dashboard 5: Business Intelligence
resource "grafana_dashboard" "business_intelligence" {
  folder      = grafana_folder.applywise.uid
  config_json = file("${var.dashboards_dir}/05-business-intelligence.json")
}

# 7. Contact Point for Alert Notifications
resource "grafana_contact_point" "sre_team" {
  name = "ApplyWise SRE Team (${var.environment})"

  email {
    addresses = [var.contact_email]
  }
}
