# =============================================================================
# ApplyWise AI — Infrastructure as Code Root Module
# =============================================================================

module "grafana_observability" {
  source = "./modules/grafana"

  folder_name    = "ApplyWise AI Operations"
  environment    = var.environment
  contact_email  = var.alert_contact_email
  dashboards_dir = "${path.module}/../observability/grafana/dashboards"
}
