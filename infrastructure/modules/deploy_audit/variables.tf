variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "default_tags" {
  type        = map(string)
  description = "Map of default key-value pair of tags to add to resources"
}

variable "audit_logs_retention_days" {
  type        = number
  description = "Retention of audit logs in days"
}

variable "account_id" {
  type        = string
  description = "AWS account id"
}

variable "region" {
  type        = string
  description = "The AWS region to deploy to"
}

variable "audit_logs_buffering_size_mb" {
  type        = number
  description = "The buffering size of kinesis firehose data stream before delivering logs, in MB"
}

variable "audit_logs_buffering_interval_seconds" {
  type        = number
  description = "The buffering interval of kinesis firehose data stream before delivering logs, in seconds"
}

variable "log_retention_in_days" {
  type        = string
  description = "Firehose logs retention in days"
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
