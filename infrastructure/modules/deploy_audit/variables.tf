variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "audit_log_retention_in_days" {
  type        = string
  description = "Retention of logs in audit log stream in days"
}

variable "audit_log_group_name" {
  type        = string
  description = "Log group name for audit logs"
}

variable "audit_log_stream_name" {
  type        = string
  description = "Log stream name for audit logs"
}

variable "pars_target_environment_name" {
  type        = string
  description = "Target environment name for PARS"
}

variable "enable_pars" {
  type        = bool
  description = "Enable PARS audit log forwarding"
}

variable "pars_account_id" {
  type        = string
  description = "PARS Account ID"
}
