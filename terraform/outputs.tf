output "grafana_folder_title" {
  description = "Title of the created Grafana folder"
  value       = module.grafana_observability.folder_title
}

output "grafana_folder_uid" {
  description = "UID of the created Grafana folder"
  value       = module.grafana_observability.folder_uid
}

output "dashboard_uids" {
  description = "Map of provisioned Grafana dashboard UIDs"
  value       = module.grafana_observability.dashboard_uids
}

output "environment" {
  description = "Environment deployed"
  value       = var.environment
}
