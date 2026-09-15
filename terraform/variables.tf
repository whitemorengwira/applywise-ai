variable "environment" {
  type        = string
  description = "Target deployment environment (development, staging, production)"
  default     = "development"
}

variable "app_name" {
  type        = string
  description = "Application name prefix for resource tagging and grouping"
  default     = "applywise-ai"
}

variable "grafana_url" {
  type        = string
  description = "Grafana Cloud instance URL (e.g. https://your-org.grafana.net)"
  default     = "https://applywise.grafana.net"
}

variable "grafana_auth" {
  type        = string
  description = "Grafana API key or Service Account token (must have Admin or Editor permissions)"
  sensitive   = true
  default     = "placeholder-grafana-token"
}

variable "alert_contact_email" {
  type        = string
  description = "Default notification email address for critical alerts"
  default     = "contact@applywise.ai"
}
