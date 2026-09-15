output "folder_title" {
  description = "Title of created Grafana folder"
  value       = grafana_folder.applywise.title
}

output "folder_uid" {
  description = "UID of created Grafana folder"
  value       = grafana_folder.applywise.uid
}

output "dashboard_uids" {
  description = "Map of provisioned dashboard UIDs"
  value = {
    application_overview  = grafana_dashboard.application_overview.uid
    ai_operations         = grafana_dashboard.ai_operations.uid
    kubernetes_workloads  = grafana_dashboard.kubernetes_workloads.uid
    database_storage      = grafana_dashboard.database_storage.uid
    business_intelligence = grafana_dashboard.business_intelligence.uid
  }
}
