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
