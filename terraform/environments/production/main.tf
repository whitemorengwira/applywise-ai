module "applywise_infra_prod" {
  source = "../../"

  environment         = "production"
  grafana_url         = var.grafana_url
  grafana_auth        = var.grafana_auth
  alert_contact_email = var.alert_contact_email
}

variable "grafana_url" {
  type    = string
  default = "https://applywise-prod.grafana.net"
}

variable "grafana_auth" {
  type      = string
  sensitive = true
  default   = "placeholder-prod-token"
}

variable "alert_contact_email" {
  type    = string
  default = "prod-alerts@applywise.ai"
}
