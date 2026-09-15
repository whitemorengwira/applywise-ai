module "applywise_infra_dev" {
  source = "../../"

  environment         = "development"
  grafana_url         = var.grafana_url
  grafana_auth        = var.grafana_auth
  alert_contact_email = var.alert_contact_email
}

variable "grafana_url" {
  type    = string
  default = "https://applywise-dev.grafana.net"
}

variable "grafana_auth" {
  type      = string
  sensitive = true
  default   = "placeholder-dev-token"
}

variable "alert_contact_email" {
  type    = string
  default = "dev-alerts@applywise.ai"
}
