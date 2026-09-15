variable "folder_name" {
  type        = string
  description = "Name of the Grafana folder to organise ApplyWise dashboards"
  default     = "ApplyWise AI Operations"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "development"
}

variable "contact_email" {
  type        = string
  description = "Contact email for alerting notification point"
  default     = "contact@applywise.ai"
}

variable "dashboards_dir" {
  type        = string
  description = "Filesystem path to the dashboard JSON definitions"
  default     = "../observability/grafana/dashboards"
}
